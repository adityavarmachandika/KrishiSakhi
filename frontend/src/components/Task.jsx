import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTractor, 
  faSeedling, 
  faBug, 
  faLeaf, 
  faFlask,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";
import { farmerTasksData } from "../constants";

// Helper function to get task icon based on task type
const getTaskIcon = (taskName) => {
  const task = taskName.toLowerCase();
  if (task.includes('irrigation') || task.includes('water')) {
    return <FontAwesomeIcon icon={faTractor} className="w-4 h-4 text-blue-600" />;
  } else if (task.includes('fertilization') || task.includes('fertilizer')) {
    return <FontAwesomeIcon icon={faSeedling} className="w-4 h-4 text-green-600" />;
  } else if (task.includes('pest') || task.includes('pesticide')) {
    return <FontAwesomeIcon icon={faBug} className="w-4 h-4 text-red-600" />;
  } else if (task.includes('harvest') || task.includes('wheat') || task.includes('crop')) {
    return <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-yellow-600" />;
  } else if (task.includes('soil') || task.includes('testing')) {
    return <FontAwesomeIcon icon={faFlask} className="w-4 h-4 text-purple-600" />;
  }
  return <FontAwesomeIcon icon={faSeedling} className="w-4 h-4 text-green-600" />;
};

// Helper function to get task priority based on date
const getTaskPriority = (date) => {
  const taskDate = new Date(date);
  const today = new Date();
  const diffTime = taskDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return { level: 'urgent', color: 'bg-red-100 text-red-700 border-red-200' };
  if (diffDays <= 3) return { level: 'high', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  return { level: 'normal', color: 'bg-green-100 text-green-700 border-green-200' };
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export default function Task() {
  const [completedTasks, setCompletedTasks] = React.useState(new Set());

  const toggleTaskCompletion = (index) => {
    setCompletedTasks(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(index)) {
        newCompleted.delete(index);
      } else {
        newCompleted.add(index);
      }
      return newCompleted;
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto lg:max-w-lg h-[500px] flex flex-col">
      <CardHeader className="text-center pb-4 px-4 sm:px-6 flex-shrink-0">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-lg sm:text-xl">Farm Tasks</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {farmerTasksData.length} tasks • {completedTasks.size} completed
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 flex-1 overflow-y-auto pb-6">
        {farmerTasksData.map((task, index) => {
          const priority = getTaskPriority(task.date);
          const isCompleted = completedTasks.has(index);
          
          return (
            <div 
              key={index} 
              className={`rounded-lg p-3 sm:p-4 border transition-all duration-200 hover:shadow-md ${
                isCompleted 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompletion(index)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {isCompleted && <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />}
                  </button>
                  {getTaskIcon(task.task)}
                  <h3 className={`font-semibold text-sm sm:text-base truncate ${
                    isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.task}
                  </h3>
                </div>
                <Badge variant="outline" className={`ml-2 flex-shrink-0 ${priority.color}`}>
                  {priority.level}
                </Badge>
              </div>

              {/* Task Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                    <span>{formatDate(task.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                    <span>{task.duration}</span>
                  </div>
                </div>
                
                {/* Task Notes */}
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isCompleted ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {task.notes}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
