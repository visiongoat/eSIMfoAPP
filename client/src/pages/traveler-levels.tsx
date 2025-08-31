import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationBar from "@/components/navigation-bar";
import { getTravelerLevel, TRAVELER_LEVELS } from "@shared/schema";
import type { User } from "@shared/schema";

export default function TravelerLevelsScreen() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<User>({
    queryKey: ["/api/profile"],
  });

  const totalSpent = parseFloat(user?.totalSpent || "0");
  const currentLevel = getTravelerLevel(totalSpent);

  return (
    <div className="mobile-screen">
      <NavigationBar 
        title="Traveler Levels"
        leftButton={
          <button 
            onClick={() => setLocation('/profile')}
            className="text-primary"
            data-testid="button-back"
          >
            ← Back
          </button>
        }
      />

      <div className="px-4 pt-4 pb-20">
        {/* Current Level Card */}
        <div className="mobile-card p-6 mb-4 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
          <div className="text-4xl mb-2">{currentLevel.emoji}</div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
            You are a {currentLevel.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">{currentLevel.description}</p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Spent: <span className="font-semibold">€{totalSpent.toFixed(0)}</span>
          </div>
        </div>

        {/* All Levels */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">All Traveler Levels</h3>
          
          {TRAVELER_LEVELS.map((level, index) => {
            const isCurrentLevel = level.key === currentLevel.key;
            const isUnlocked = totalSpent >= level.minSpent;
            const isNextLevel = !isUnlocked && level.minSpent > currentLevel.minSpent && 
              TRAVELER_LEVELS.findIndex(l => l.minSpent > currentLevel.minSpent && l.minSpent <= totalSpent) === -1 &&
              TRAVELER_LEVELS.findIndex(l => l.minSpent > currentLevel.minSpent) === index;

            return (
              <div 
                key={level.key}
                className={`mobile-card p-4 border-l-4 ${
                  isCurrentLevel 
                    ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10' 
                    : isUnlocked
                    ? 'border-l-gray-400 bg-gray-50 dark:bg-gray-800/50'
                    : isNextLevel
                    ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-l-gray-200 dark:border-l-gray-700'
                }`}
                data-testid={`card-level-${level.key}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      isCurrentLevel
                        ? 'bg-green-100 dark:bg-green-800 border-2 border-green-500'
                        : isUnlocked
                        ? `${
                            level.color === 'gray' ? 'bg-gray-100 dark:bg-gray-700' :
                            level.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800' :
                            level.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800' :
                            level.color === 'gold' ? 'bg-yellow-100 dark:bg-yellow-800' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`
                        : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                    }`}>
                      {level.emoji}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {level.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  
                  {isCurrentLevel && (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm font-medium">
                      <span>Current</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {isNextLevel && (
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Next Level
                    </div>
                  )}
                </div>

                {/* Spending Requirement */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Spending Requirement
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    €{level.minSpent}{level.maxSpent ? ` - €${level.maxSpent}` : '+'}
                  </div>
                </div>

                {/* Benefits */}
                {level.benefits && level.benefits.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Benefits
                    </div>
                    <div className="space-y-1">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isUnlocked ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className={
                            isUnlocked 
                              ? 'text-gray-900 dark:text-gray-100' 
                              : 'text-gray-500 dark:text-gray-500'
                          }>
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlock Status */}
                {!isUnlocked && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Spend €{(level.minSpent - totalSpent).toFixed(0)} more to unlock
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        <div className="mobile-card p-4 mt-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-2xl mb-2">🌍</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Keep Exploring!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The more you travel with eSIMfo, the more exclusive benefits you unlock. 
            Each purchase brings you closer to your next traveler level!
          </p>
        </div>
      </div>
    </div>
  );
}