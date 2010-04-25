system.use("com.joyent.Sammy");
system.use("com.joyent.Resource");
system.use("com.google.code.date");

// our objects (MODEL)
system.use("Class");

system.use("Profile");

// also contains control logic inside
system.use("Psession");

system.use("Rating");

system.use("InClass");

// actions (CONTROL)
// Take care of registering teacher / student
system.use("Register");

GET("/", function() {
  return template("index.html");
});
