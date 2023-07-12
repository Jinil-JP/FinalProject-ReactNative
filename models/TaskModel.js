// TaskModel.js
class Task {
  constructor(
    id,
    name,
    description,
    startDate,
    endDate,
    isStarted,
    isCompleted,
    isPrerequisite,
    hoursWorked,
    member,
    taskStartTime,
    taskEndTime
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isStarted = isStarted;
    this.isCompleted = isCompleted;
    this.isPrerequisite = isPrerequisite;
    this.hoursWorked = hoursWorked;
    this.member = member;
    this.taskStartTime = taskStartTime;
    this.taskEndTime = taskEndTime;
  }
}

export default Task;
