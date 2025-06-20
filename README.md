# Goal Management App

A fullstack application to manage personal goals with support for nested (parent-child) structure, public/private visibility, drag-and-drop reordering, and pagination. Users can also view shared public goals via a public dashboard.

---
## 🧰 Tech Stack Summary

### Frontend:
- [Angular 16+](https://angular.io)
- Angular Material
- CDK Drag and Drop
- CSS for styling

### Backend:
- [NestJS](https://nestjs.com)
- TypeORM (ORM)
- PostgreSQL (relational DB)
- Passport.js (JWT Authentication)

## 🛠 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/goal-management-app.git
   cd goal-management-app

2. **Install backend dependencies:**
  cd server
  npm install

3. **Set up environment variables:**
  Create a .env file with your DB connection:
- DATABASE_URL=
- JWT_ACCESS_SECRET=
- JWT_REFRESH_SECRET=
- SUPER_ADMIN_USERNAME= 
- SUPER_ADMIN_EMAIL=
- SUPER_ADMIN_PASSWORD=

4. **Start the backend:**
npm run start:dev

5. **Frontend Setup:**
cd ../client
npm install

5. **Run the Angular app:**
npm start


## Database Choice Explanation
PostgreSQL for its powerful relational capabilities, allowing us to model complex parent-child goal relationships using foreign keys and joins. Its support for recursive queries makes it well-suited for representing hierarchical data.

## Key Decisions and Trade-offs
- Nested Goal Structure: Represented goals recursively with parent-child references. Easier to maintain than a flat structure.

- Readonly Public Page: Public goals are fully browsable in a separate section, but interaction is disabled to prevent unauthorized changes.

- Single Source of Truth: The same goal entity model is used across public and private views, promoting reusability but requiring conditional rendering.

- Drag-and-Drop: Integrated Angular CDK for intuitive reordering. For public pages, drag is disabled.

## Known Limitations or Pending Features
🌀 Pagination (for dashboard and public) is not yet implemented.

🔍 Search and filtering are not available yet.

🚀 Optimistic UI updates are not used; changes wait for server response.

🛡️ Soft deletes are not supported (deletion is permanent).

🧪 Unit/integration tests are limited and need expansion for production.