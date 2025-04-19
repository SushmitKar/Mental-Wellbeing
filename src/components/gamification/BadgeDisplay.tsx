import { motion } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateAwarded: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}

export default function BadgeDisplay({ badges, onBadgeClick }: BadgeDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
          onClick={() => onBadgeClick?.(badge)}
        >
          <div className="bg-white rounded-lg shadow-lg p-4 transition-all duration-300 group-hover:shadow-xl">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-3">
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-800 text-center">
                {badge.name}
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <p className="text-white text-xs text-center">
                  {badge.description}
                  <br />
                  <span className="text-gray-300 text-xs mt-1 block">
                    Awarded: {new Date(badge.dateAwarded).toLocaleDateString()}
                  </span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 