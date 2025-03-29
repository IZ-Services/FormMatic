interface Window {
    checkSubscriptionStatus: () => boolean;
    mockNonSubscribedUser: () => void;
    mockUserCreationTime: (daysAgo: number) => void;
    firebase?: {
      auth?: {
        currentUser?: {
          metadata: {
            creationTime: string;
          };
        };
      };
    };
  }