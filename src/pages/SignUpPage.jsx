import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    skillLevel: 'Beginner',
    jurisdiction: 'Kenya Law',
    rolePreference: 'Prosecutor',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    // Demo: check if user exists
    const user = JSON.parse(localStorage.getItem('kesi-user'));
    if (user && user.email === formData.email) {
      setIsLoading(false);
      setError('User already exists. Please login.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      setError('Passwords do not match.');
      return;
    }
    // Save user to localStorage
    localStorage.setItem('kesi-user', JSON.stringify({
      email: formData.email,
      password: formData.password,
      skillLevel: formData.skillLevel,
      jurisdiction: formData.jurisdiction,
      rolePreference: formData.rolePreference,
    }));
    setIsLoading(false);
    setSuccess('Account created! Redirecting to login...');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Email address</label>
              <div className="flex-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Password</label>
              <div className="flex-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Confirm Password</label>
              <div className="flex-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Skill Level</label>
              <div className="flex-1">
                <select
                  id="skillLevel"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Jurisdiction Preference</label>
              <div className="flex-1">
                <select
                  id="jurisdiction"
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Kenya Law">Kenya Law</option>
                  <option value="UK Law">UK Law</option>
                  <option value="US Law">US Law</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label htmlFor="rolePreference" className="block text-sm font-medium text-gray-700 md:w-48 md:text-right md:mb-0 mb-1">Courtroom Role Preference</label>
              <div className="flex-1">
                <select
                  id="rolePreference"
                  name="rolePreference"
                  value={formData.rolePreference}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Prosecutor">Prosecutor</option>
                  <option value="Defense">Defense</option>
                  <option value="Judge">Judge</option>
                  <option value="Clerk">Clerk</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 