
import { useState } from 'react';
import Header from '../Home/Header';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const CheckPassowrd = () => {
    if (name.trim() === "" || surname.trim() === "" || email.trim() === "") {
      setError("All fields are required");
      return false;
    }
    if (name.length < 3 || surname.length < 3) {
      setError("Name and Surname must be at least 3 characters long");
      return false;
    }
    if (/^[A-Za-z]+$/.test(name) === false) {
      setError("Name must contain only letters");
      return false;
    }
    if (/^[A-Za-z]+$/.test(surname) === false) {
      setError("Surname must contain only letters");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError(null);
    return true;
  };

  const Submit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setLoading(true);

    const ok = CheckPassowrd();
    if (!ok) {
      setLoading(false);
      return
    };

    const userData = {
      name,
      surname,
      email,
      password
    };

    try {
      const res = await api.post("/users/register", userData);

      console.log("Server Response:", res.data);

      setSuccess("Registration Successful!");
      setError(null);

      navigate('/verify-email', { state: { email } });

      localStorage.setItem("unverifiedEmail", email);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);  // Stop loading after request completes
    }
    // Submit form data to the server or perform other actions
    console.log("Form submitted:", { name, surname, email, password });

    // Example: Sending data to the server using axios


  };





  return (

    <>
      <Header className="fixed top-2 left-0 right-0 z-50" />
      <div className="min-h-screen flex" style={{ backgroundColor: '#AFAFAF' }}>

        {/* Left Side - Clean Sketchfab 3D Model */}
        <div className="hidden lg:flex lg:w-1/2 h-screen">
          <iframe
            title="Nike Air Jordan"
            className="w-full h-full"
            src="https://sketchfab.com/models/c00345fd64414c4e8895c6aaa262e4d5/embed?autospin=1&autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&ui_color=FFFFFF&ui_fps=0&ui_hint=0&ui_toolbar=0&ui_theme=dark&camera=0&scrollwheel=true"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowfullscreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            style={{ backgroundColor: '#AFAFAF' }}
          ></iframe>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1  flex items-center justify-center h-screen overflow-hidden bg-[#E1E1E1] ">
          <div className="w-full max-w-md mx-8">

            <div className="  py-10 px-8 rounded-3xl ">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-900-gray italic bg-clip-text mb-2">
                  JOIN NIKE
                </h2>
                <p className="text-gray-600 font-medium text-lg">
                  Create your account
                </p>
                {success && (
                  <p className="text-green-600 font-semibold text-sm mt-2">
                    {success}
                  </p>
                )}

              </div>

              <form className="space-y-6" onSubmit={Submit} >

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      name="firstName"
                      type="text"
                      required
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                      placeholder="First Name"
                    />
                  </div>

                  <div>
                    <input
                      name="lastName"
                      type="text"
                      required
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b-2  border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium "
                    placeholder="Email Address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 
                      focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                    />

                    {/* Eye Button */}
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-[#E1E1E1] p-1 "
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}

                    </span>
                  </div>


                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 
                      focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                    />

                    {/* Eye Button */}
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-[#E1E1E1] px-1"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}

                    </span>
                  </div>

                </div>
                <div className="h-1 transition-all duration-300">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl">
                  <input
                    id="receiveEmails"
                    name="receiveEmails"
                    type="checkbox"

                    className="focus:ring-black h-5 w-5 text-black border-gray-400 rounded transition-colors duration-300"
                  />
                  <label htmlFor="receiveEmails" className="block text-sm text-gray-700 font-medium">
                    Send me exclusive offers and updates
                  </label>
                </div>

             <button
  type="submit"
  disabled={loading}
  className={`w-full py-4 px-4 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white 
  bg-black hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center
  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
>
  {loading ? (
    <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Create Account"
  )}
</button>


                <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                  Already have an account?{' '}
                  <a href="/login" className="font-black text-gray-900 hover:underline transition-all duration-300">
                    SIGN IN
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;