import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Send } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { submitContactForm } from "../../services/contactService";
import SectionTitle from "../../components/Cards/SectionTitle";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const res = await submitContactForm(formData);

      if (res.success) {
        toast.success(res.message);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send your message."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | AK BloodBridge</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <SectionTitle
          title="Contact Us"
          subtitle="Have a question, feedback, or need assistance?"
        />

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 sm:p-8 mt-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <label className="text-l text-gray-600 dark:text-gray-300 mb-1 block">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-100 outline-none focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="text-l text-gray-600 dark:text-gray-300 mb-1 block">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                  className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-100 outline-none focus:border-red-500 transition"
                />
              </div>

            </div>

            <div>
              <label className="text-l text-gray-600 dark:text-gray-300 mb-1 block">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
                className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-100 outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="text-l text-gray-600 dark:text-gray-300 mb-1 block">
                Message
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Write your message here..."
                className="w-full rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-100 outline-none focus:border-red-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

          </form>
        </div>

        {/* Contact Information */}

        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow p-5 sm:p-6 border border-gray-100 dark:border-gray-800">

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Contact Information
          </h3>

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0">

              <Mail
                size={20}
                className="text-red-600 dark:text-red-400"
              />

            </div>

            <div>

              <a
                href="mailto:akbloodbridge@gmail.com"
                className="text-red-600 dark:text-red-400 font-semibold hover:underline break-all"
              >
                akbloodbridge@gmail.com
              </a>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                For feedback, general queries, or support, feel free to reach out to us anytime.
              </p>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default ContactPage;