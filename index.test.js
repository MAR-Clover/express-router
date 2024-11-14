const request = require("supertest");
const app = require("./src/app");
const User = require("./models/User")
//const bulkData = require("./seedData")
//const Users = require("./models/User");


describe("User Routes", () => {

    // Clear the table and seed data before each test
    beforeEach(async () => {
        let seedUsers = [
            { name: "User 1", age: 30 },
            { name: "User 2", age: 45 },
            { name: "User 3", age: 27 },
            { name: "User 4", age: 22 }
        ];
        
        await User.truncate(); // Clears all entries in the table
        await User.bulkCreate(seedUsers); // Seeds the users table
    });

    it("GET /users - should return all users", async () => {
        const response = await request(app).get("/users");
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Check if response is an array
    });

    it("GET /users/:id - should return a single user by ID", async () => {
        
        const user = await User.findOne({ where: { name: "User 1" } }); 
        const userId = user.id; 
        
        const response = await request(app).get(`/users/${userId}`);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId); 
    });

    it("POST /users - should create a new user", async () => {
        const newUser = { name: "John Doe", age: 121 }; 
        const response = await request(app).post("/users").send(newUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "John Doe");
        
    });
    
    it("PUT /users/:id - should update an existing user", async () => {

        //Id's vary every time the test is ran since it is not explicitly defined, therefore
        //I have to find a user by name and then use their ID to test the post endpoint
        const userToUpdate = await User.findOne({where:{name:"User 1"}})
        const updates = { name: "Jane Doe" };
        const response = await request(app).put(`/users/${userToUpdate.id}`).send(updates);
        expect(response.status).toBe(200);
    });

       it("DELETE /users/:id - should delete a user by ID", async () => {
        const userToUpdate = await User.findOne({where:{name:"User 3"}})
        const response = await request(app).delete(`/users/${userToUpdate.id}`);
        expect(response.status).toBe(200);
    });
});



 

