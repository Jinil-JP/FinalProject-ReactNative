class Member {
  constructor(userId, name, email, hourlyRate, password, isAdmin = false) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.hourlyRate = hourlyRate;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

export default Member;
