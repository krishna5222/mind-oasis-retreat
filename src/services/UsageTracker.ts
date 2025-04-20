// A service to track app usage in real-time

interface AppUsageData {
  appName: string;
  timeSpent: number; // In minutes
  dailyLimit: number | null; // In minutes, null if no limit set
  iconUrl: string;
  date: string; // Format: YYYY-MM-DD
}

interface DailyUsageSummary {
  date: string; // Format: YYYY-MM-DD
  totalMinutes: number;
  savedMinutes: number;
  // For each app on this date
  appUsage: {
    [appName: string]: number; // minutes used
  };
}

class UsageTracker {
  private static instance: UsageTracker;
  private sessionStartTime: Record<string, number> = {}; // Timestamp when usage started
  private todaysUsage: Record<string, number> = {}; // Minutes used today
  private isTracking = false;
  private notificationSent: Record<string, boolean> = {}; // Track which notifications were sent

  // Private constructor for singleton
  private constructor() {
    this.loadTodaysUsage();
    
    // Set up daily reset at midnight
    this.setupMidnightReset();
  }

  public static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  // Start tracking app usage
  public startTracking(appName: string): void {
    if (!this.sessionStartTime[appName]) {
      this.sessionStartTime[appName] = Date.now();
    }
  }

  // Stop tracking and record usage
  public stopTracking(appName: string): void {
    if (this.sessionStartTime[appName]) {
      const sessionDuration = (Date.now() - this.sessionStartTime[appName]) / (1000 * 60); // Convert to minutes
      this.recordUsage(appName, sessionDuration);
      delete this.sessionStartTime[appName];
    }
  }

  // Manually record usage time
  public recordUsage(appName: string, minutes: number): void {
    // Initialize if this is first usage
    if (!this.todaysUsage[appName]) {
      this.todaysUsage[appName] = 0;
    }
    
    this.todaysUsage[appName] += minutes;
    
    // Save the updated usage
    this.saveTodaysUsage();
    
    // Save to history
    this.saveToUsageHistory(appName, minutes);
    
    // Check limits and trigger notifications
    this.checkLimits(appName);
  }

  // Get today's usage for a specific app
  public getAppUsage(appName: string): number {
    return this.todaysUsage[appName] || 0;
  }

  // Get usage for all apps today
  public getAllAppUsage(): Record<string, number> {
    return { ...this.todaysUsage };
  }

  // Check if app should be blocked based on limits
  public shouldBlockApp(appName: string): boolean {
    const appLimit = this.getAppLimit(appName);
    const appUsage = this.getAppUsage(appName);
    
    // If no limit set or usage is below limit, don't block
    if (!appLimit || appUsage < appLimit) {
      return false;
    }
    
    return true;
  }
  
  // Get percentage of daily limit used
  public getUsagePercentage(appName: string): number {
    const limit = this.getAppLimit(appName);
    const usage = this.getAppUsage(appName);
    
    if (!limit || limit === 0) return 0;
    
    return Math.min(100, Math.round((usage / limit) * 100));
  }
  
  // Get app daily limit
  private getAppLimit(appName: string): number | null {
    // Get from localStorage
    const savedLimits = localStorage.getItem('mindCleanseAppLimits');
    if (savedLimits) {
      const limits = JSON.parse(savedLimits);
      const appConfig = limits.find((app: any) => app.appName === appName);
      if (appConfig) {
        return appConfig.dailyLimit;
      }
    }
    return null;
  }

  // Load today's usage from storage
  private loadTodaysUsage(): void {
    const today = this.getDateString();
    const savedUsage = localStorage.getItem(`mindCleanseUsage_${today}`);
    
    if (savedUsage) {
      this.todaysUsage = JSON.parse(savedUsage);
      
      // Also load notification state
      const savedNotifications = localStorage.getItem(`mindCleanseNotifications_${today}`);
      if (savedNotifications) {
        this.notificationSent = JSON.parse(savedNotifications);
      }
    } else {
      this.todaysUsage = {};
      this.notificationSent = {};
    }
  }

  // Save today's usage to storage
  private saveTodaysUsage(): void {
    const today = this.getDateString();
    localStorage.setItem(`mindCleanseUsage_${today}`, JSON.stringify(this.todaysUsage));
    localStorage.setItem(`mindCleanseNotifications_${today}`, JSON.stringify(this.notificationSent));
  }

  // Save usage to historical data
  private saveToUsageHistory(appName: string, minutes: number): void {
    const today = this.getDateString();
    
    // Get existing history or initialize new
    let history = localStorage.getItem('mindCleanseUsageHistory');
    let usageHistory: Record<string, DailyUsageSummary> = {};
    
    if (history) {
      usageHistory = JSON.parse(history);
    }
    
    // Update or create today's entry
    if (!usageHistory[today]) {
      usageHistory[today] = {
        date: today,
        totalMinutes: 0,
        savedMinutes: 0,
        appUsage: {}
      };
    }
    
    // Initialize app usage if not exists
    if (!usageHistory[today].appUsage[appName]) {
      usageHistory[today].appUsage[appName] = 0;
    }
    
    // Update usage
    usageHistory[today].appUsage[appName] += minutes;
    usageHistory[today].totalMinutes += minutes;
    
    // Only keep last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = this.getDateString(thirtyDaysAgo);
    
    Object.keys(usageHistory).forEach(date => {
      if (date < cutoffDate) {
        delete usageHistory[date];
      }
    });
    
    // Save updated history
    localStorage.setItem('mindCleanseUsageHistory', JSON.stringify(usageHistory));
  }

  // Check if app usage has reached limit thresholds
  private checkLimits(appName: string): void {
    const limit = this.getAppLimit(appName);
    const usage = this.getAppUsage(appName);
    
    if (!limit) return; // No limit set
    
    const percentage = (usage / limit) * 100;
    
    // Check for 80% notification
    if (percentage >= 80 && percentage < 100 && !this.notificationSent[`${appName}_80`]) {
      this.sendNotification(
        `${appName} Time Limit Warning`,
        `You've reached 80% of your daily limit for ${appName}.`
      );
      this.notificationSent[`${appName}_80`] = true;
    }
    
    // Check for 100% notification
    if (percentage >= 100 && !this.notificationSent[`${appName}_100`]) {
      this.sendNotification(
        `${appName} Time Limit Reached`,
        `You've used all your allowed time on ${appName} today.`
      );
      this.notificationSent[`${appName}_100`] = true;
    }
    
    // Save notification state
    this.saveTodaysUsage();
  }

  // Send notification
  private sendNotification(title: string, message: string): void {
    // Use the toast system for now
    // In a real app, this would connect to system notifications
    import('sonner').then(({ toast }) => {
      toast({
        title,
        description: message
      });
    });
  }

  // Reset usage at midnight
  private setupMidnightReset(): void {
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // tomorrow
      0, 0, 0 // midnight
    );
    
    const msUntilMidnight = night.getTime() - now.getTime();
    
    // Set timeout for midnight reset
    setTimeout(() => {
      this.resetDailyUsage();
      // Setup the next day's reset
      this.setupMidnightReset();
    }, msUntilMidnight);
  }

  // Reset daily usage counters
  public resetDailyUsage(): void {
    // Save yesterday's data first if needed
    
    // Reset
    this.todaysUsage = {};
    this.notificationSent = {};
    
    // Save empty usage for today
    this.saveTodaysUsage();
    
    // Emit reset event that components can listen to
    const resetEvent = new CustomEvent('usageReset');
    window.dispatchEvent(resetEvent);
  }

  // Get date string in YYYY-MM-DD format
  private getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  // Get usage history for the last 7 days
  public getWeeklyUsage(): DailyUsageSummary[] {
    const result: DailyUsageSummary[] = [];
    const history = localStorage.getItem('mindCleanseUsageHistory');
    
    if (history) {
      const usageHistory: Record<string, DailyUsageSummary> = JSON.parse(history);
      
      // Get last 7 days
      const dates = Object.keys(usageHistory).sort().slice(-7);
      
      dates.forEach(date => {
        result.push(usageHistory[date]);
      });
    }
    
    return result;
  }
  
  // Get usage for a specific day
  public getDailyUsage(date: string): DailyUsageSummary | null {
    const history = localStorage.getItem('mindCleanseUsageHistory');
    
    if (history) {
      const usageHistory: Record<string, DailyUsageSummary> = JSON.parse(history);
      return usageHistory[date] || null;
    }
    
    return null;
  }
}

// Export singleton instance
export default UsageTracker.getInstance();
