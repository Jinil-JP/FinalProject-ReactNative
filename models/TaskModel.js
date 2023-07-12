// TaskModel.js
class Task {
  constructor(
    id,
    name,
    description,
    startDate,
    endDate,
    isCompleted,
    hoursWorked,
    member
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isCompleted = isCompleted;
    this.hoursWorked = hoursWorked;
    this.member = member;
  }
}

export default Task;
