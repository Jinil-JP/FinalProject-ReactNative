class Member {
  constructor(userId, name, email, isAdmin = false, hourlyRate, password) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.hourlyRate = hourlyRate;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

export default Member;
