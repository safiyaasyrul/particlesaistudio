fetch("http://localhost:3000/api/registrations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Testing", email: "nurdiyana@umt.edu.my", category: "Standard" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
