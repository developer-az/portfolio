'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './instagram-analyzer.module.scss';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import enhanced components
// Assumes EnhancedBackground is available - otherwise, you can remove this import
// import { EnhancedBackground } from '../../components';

export default function InstagramAnalyzer() {
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const followersInputRef = useRef(null);
  const followingInputRef = useRef(null);
  const headerRef = useRef(null);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 100) {
          headerRef.current.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
          headerRef.current.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
        } else {
          headerRef.current.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
          headerRef.current.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFollowersFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFollowersFile(e.target.files[0]);
    }
  };

  const handleFollowingFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFollowingFile(e.target.files[0]);
    }
  };

  const extractUsernamesFromHtml = (htmlText) => {
    const pattern = /https:\/\/www\.instagram\.com\/([^/"]+)/g;
    const matches = [...htmlText.matchAll(pattern)];
    return matches.map(match => match[1]);
  };

  const findUnfollowers = (followers, following) => {
    return following.filter(user => !followers.includes(user));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!followersFile || !followingFile) {
      setError('Please upload both files');
      setIsLoading(false);
      return;
    }

    try {
      // Read the files
      const followersText = await followersFile.text();
      const followingText = await followingFile.text();

      // Extract usernames
      const followers = extractUsernamesFromHtml(followersText);
      const following = extractUsernamesFromHtml(followingText);

      if (followers.length === 0 || following.length === 0) {
        setError('Could not extract Instagram usernames from the uploaded files. Please ensure you\'re uploading the correct HTML files from Instagram.');
        setIsLoading(false);
        return;
      }

      // Find unfollowers
      const unfollowers = findUnfollowers(followers, following);

      // Remove duplicates
      const uniqueUnfollowers = [...new Set(unfollowers)];

      setResults({
        unfollowers: uniqueUnfollowers,
        followersCount: followers.length,
        followingCount: following.length,
        unfollowersCount: uniqueUnfollowers.length
      });
    } catch (err) {
      setError('An error occurred while processing the files: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFollowersFile(null);
    setFollowingFile(null);
    setResults(null);
    setError(null);
    
    // Reset file inputs
    if (followersInputRef.current) followersInputRef.current.value = "";
    if (followingInputRef.current) followingInputRef.current.value = "";
  };

  // Tutorial component
  const InstagramDataTutorial = () => (
    <motion.div 
      className={styles.tutorialOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.tutorialContent}>
        <button 
          className={styles.closeButton}
          onClick={() => setShowTutorial(false)}
        >
          ✕
        </button>
        
        <h2>How to Download Your Instagram Data</h2>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h3>Log in to Instagram</h3>
            <p>Open Instagram in a web browser and log in to your account.</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h3>Access Your Account Settings</h3>
            <p>Click on your profile picture in the top right, then select <strong>Settings and privacy</strong>.</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h3>Request Download</h3>
            <p>Scroll to <strong>Data download</strong> and click <strong>Request download</strong>.</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h3>Choose Format</h3>
            <p>Select <strong>HTML</strong> as the format and choose <strong>Information about you</strong>.</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>5</div>
          <div className={styles.stepContent}>
            <h3>Provide Your Email & Password</h3>
            <p>Enter your email and password, then submit your request.</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>6</div>
          <div className={styles.stepContent}>
            <h3>Download Your Data</h3>
            <p>Instagram will email you a link to download your data when it's ready (usually within 48 hours).</p>
          </div>
        </div>
        
        <div className={styles.tutorialStep}>
          <div className={styles.stepNumber}>7</div>
          <div className={styles.stepContent}>
            <h3>Extract & Locate Files</h3>
            <p>Download and extract the ZIP file. Look for <strong>followers.html</strong> and <strong>following.html</strong> files in the extracted folder.</p>
          </div>
        </div>
        
        <div className={styles.tutorialNote}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Your data is processed entirely in your browser. No information is sent to any server, making this tool completely private and secure.</p>
        </div>
        
        <button 
          className={styles.closeButton}
          onClick={() => setShowTutorial(false)}
        >
          Close Tutorial
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className={styles.mainWrapper}>
      {/* Optional: Add the enhanced background */}
      {/*<EnhancedBackground color="#121212" />*/}
      
      <div className={styles.portfolioWrapper}>
        {/* Header */}
        <header ref={headerRef} className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              <p className={styles.copyright}>©</p>
              <div className={styles.logoText}>
                <p className={styles.codeBy}>Code by</p>
                <h1 className={styles.name}>
                  <span className={styles.firstName}>Anthony</span>
                  <span className={styles.lastName}>Zhou</span>
                </h1>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className={styles.nav}>
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/#work" className={styles.navLink}>Work</Link>
              <Link href="/#about" className={styles.navLink}>About</Link>
              <Link href="/#contact" className={styles.navLink}>Contact</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className={styles.menuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div
                className={`${styles.menuButtonLine} ${
                  mobileMenuOpen ? styles.active : ""
                }`}
              ></div>
              <div
                className={`${styles.menuButtonLine} ${
                  mobileMenuOpen ? styles.active : ""
                }`}
              ></div>
              <div
                className={`${styles.menuButtonLine} ${
                  mobileMenuOpen ? styles.active : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}>
            <div className={styles.mobileMenuContent}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/#work" onClick={() => setMobileMenuOpen(false)}>
                Work
              </Link>
              <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </header>

        <div className={styles.portfolioContent}>
          <section className={styles.instagramAnalyzer}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2>Instagram Follower Analyzer</h2>
              <p>Find out who doesn't follow you back on Instagram by uploading your followers and following HTML files.</p>
              
              <div className={styles.instructions}>
                <h3>How to use:</h3>
                <ol>
                  <li>Go to your Instagram account and download your data in HTML format 
                    <button 
                      className={styles.tutorialButton}
                      onClick={() => setShowTutorial(true)}
                    >
                      See how
                    </button>
                  </li>
                  <li>Upload your <strong>followers.html</strong> and <strong>following.html</strong> files</li>
                  <li>Click analyze to see who doesn't follow you back</li>
                </ol>
                <p className={styles.privacyNote}>Your files are processed entirely in your browser. No data is sent to any server.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.analyzerForm}>
                <div className={styles.fileInputs}>
                  <div className={styles.fileInput}>
                    <label>Followers HTML file:</label>
                    <input 
                      type="file" 
                      accept=".html, .htm" 
                      onChange={handleFollowersFileChange}
                      ref={followersInputRef}
                    />
                    {followersFile && <p className={styles.fileName}>Selected: {followersFile.name}</p>}
                  </div>

                  <div className={styles.fileInput}>
                    <label>Following HTML file:</label>
                    <input 
                      type="file" 
                      accept=".html, .htm" 
                      onChange={handleFollowingFileChange}
                      ref={followingInputRef}
                    />
                    {followingFile && <p className={styles.fileName}>Selected: {followingFile.name}</p>}
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button 
                    type="submit" 
                    className={styles.analyzeButton}
                    disabled={isLoading || (!followersFile || !followingFile)}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                  </button>
                  
                  {(followersFile || followingFile || results) && (
                    <button 
                      type="button" 
                      className={styles.resetButton}
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <div className={styles.error}>
                  <p>{error}</p>
                </div>
              )}

              {results && (
                <motion.div 
                  className={styles.results}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>Analysis Results</h3>
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{results.followingCount}</span>
                      <span className={styles.statLabel}>Following</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{results.followersCount}</span>
                      <span className={styles.statLabel}>Followers</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{results.unfollowersCount}</span>
                      <span className={styles.statLabel}>Not Following Back</span>
                    </div>
                  </div>

                  <h4>People who don't follow you back:</h4>
                  {results.unfollowers.length > 0 ? (
                    <div className={styles.unfollowersList}>
                      {results.unfollowers.map((username, index) => (
                        <div key={index} className={styles.unfollower}>
                          <span>@{username}</span>
                          <a 
                            href={`https://www.instagram.com/${username}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.viewProfileButton}
                          >
                            View Profile
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noUnfollowers}>Great news! Everyone you follow also follows you back.</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </section>
          
          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.copyright}>
                <p>© 2025 Anthony Zhou - All Rights Reserved</p>
              </div>
              
              <div className={styles.techStack}>
                <p>Built with Next.js, Framer Motion, and data analysis</p>
              </div>
              
              <div className={styles.scrollToTop}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="Scroll to top"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && <InstagramDataTutorial />}
      </AnimatePresence>
    </div>
  );
}