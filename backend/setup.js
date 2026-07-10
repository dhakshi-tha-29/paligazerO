const { execSync } = require('child_process');
const connectDB = require('./config/database');

const setup = async () => {
  console.log('Setting up PaliGazer - Plagiarism Detection System');
  console.log('');

  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });

  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname + '/../frontend' });

  console.log('Connecting to MongoDB...');
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Could not connect to MongoDB. Make sure MONGODB_URI is set in .env');
    console.error(error.message);
  }

  console.log('');
  console.log('Setup complete!');
  console.log('');
  console.log('To configure:');
  console.log('  1. Make sure MongoDB is running on localhost:27017 or update MONGODB_URI in .env');
  console.log('  2. Run: cd backend && npm run seed   (to insert sample data)');
  console.log('');
  console.log('To start:');
  console.log('  Backend:  cd backend && npm run dev');
  console.log('  Frontend: cd frontend && npm start');
  console.log('');
};

setup().catch(console.error);
