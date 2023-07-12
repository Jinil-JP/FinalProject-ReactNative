class Task {
  constructor(
    id,
    name,
    description,
    startDate,
    endDate,
    isCompleted,
    hoursWorked,
    member,
    isprerequisite
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isCompleted = isCompleted;
    this.hoursWorked = hoursWorked;
    this.member = member;
    this.isprerequisite = isprerequisite
  }
}
