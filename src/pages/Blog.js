import React, { useState } from "react";
import "./css/Blog.css";
import blogData from "../data/blog.json";
import { useToast } from '../context/ToastContext'; // Importing the toast context

const Blog = () => {
  const postsPerPage = 3; // Number of posts to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast(); // Using the toast context

  // Calculate the indices for slicing the blog posts array
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogData.blogs.slice(indexOfFirstPost, indexOfLastPost);

  // Function to handle page change and scroll to top
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    showToast('Page changed successfully!', 'success'); // Trigger a toast notification
  };

  // Total number of pages
  const totalPages = Math.ceil(blogData.blogs.length / postsPerPage);

  return (
    <div className="blog-container">
      {/* Blog Header */}
      <header className="blog-header">
        <h1>Insights & Articles</h1>
        <p>
          Stay updated with the latest trends, news, and insights in sentiment
          analysis and AI technology.
        </p>
      </header>

      {/* Blog Content */}
      <div className="blog-content">
        {/* Main Blog Posts Section */}
        <section className="blog-posts">
          {currentPosts.map((blog, index) => (
            <article className="blog-post" key={index}>
              <h2>
                <a href={blog.link} target="_blank" rel="noopener noreferrer"  onClick={() => showToast('Redirecting to article...', 'info')}>
                  {blog.title}
                </a>
              </h2>
              <p>{blog.description}</p>
              <img
                src={blog.image}
                alt={blog.title}
                className="blog-image"
              />
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="read-more"
                onClick={() => showToast('Redirecting to article...', 'info')} // Trigger toast on read more
              >
                Read More
              </a>
            </article>
          ))}
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Recent Posts */}
          <div className="recent-posts">
            <h3>Recent Posts</h3>
            <ul>
              {blogData.blogs.slice(0, 5).map((blog, index) => (
                <li key={index}>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => showToast('Viewing a recent post...', 'info')} // Toast for recent posts
                  >
                    {blog.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className="page-btn"
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
