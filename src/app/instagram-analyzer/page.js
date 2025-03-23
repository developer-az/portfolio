'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './instagram-analyzer.module.scss';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import FloatingNav from '@/components/FloatingNav';

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
  const { theme } = useTheme();

  // Header scroll effect for slight background/light shadow changes
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 100) {
          headerRef.current.style.backgroundColor = theme === 'dark' ? 
            'rgba(18, 18, 18, 0.95)' : 'rgba(248, 249, 250, 0.95)';
          headerRef.current.style.boxShadow = theme === 'dark' ?
            '0 3px 10px rgba(0, 0, 0, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.1)';
        } else {
          headerRef.current.style.backgroundColor = theme === 'dark' ? 
            'rgba(18, 18, 18, 0.8)' : 'rgba(248, 249, 250, 0.8)';
          headerRef.current.style.boxShadow = 'none';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

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
      const followersText = await followersFile.text();
      const followingText = await followingFile.text();
      const followers = extractUsernamesFromHtml(followersText);
      const following = extractUsernamesFromHtml(followingText);

      if (followers.length === 0 || following.length === 0) {
        setError('Could not extract Instagram usernames from the files. Ensure you are uploading the correct HTML files.');
        setIsLoading(false);
        return;
      }

      const unfollowers = findUnfollowers(followers, following);
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
      onClick={() => setShowTutorial(false)}
    >
      <motion.div 
        className={styles.tutorialContent}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button 
          className={styles.closeButton}
          onClick={() => setShowTutorial(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2>How to Download Your Instagram Data</h2>
        
        <div className={styles.tutorialSteps}>
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Log in to Instagram</h3>
              <p>Open Instagram in your browser and sign in to your account.</p>
            </div>
          </div>
          
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Access Settings</h3>
              <p>Click your profile picture in the top right and select <strong>Settings and privacy</strong>.</p>
            </div>
          </div>
          
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Request Data</h3>
              <p>Scroll to <strong>Data download</strong> and click <strong>Request download</strong>.</p>
            </div>
          </div>
          
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Select HTML Format</h3>
              <p>Choose <strong>HTML</strong> format and select <strong>Information about you</strong>.</p>
            </div>
          </div>
          
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3>Confirm & Download</h3>
              <p>Enter your email and password, then submit. Instagram will email you the download link (usually within 48 hours).</p>
            </div>
          </div>
          
          <div className={styles.tutorialStep}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepContent}>
              <h3>Extract Files</h3>
              <p>Download and extract the ZIP file. Locate <strong>followers.html</strong> and <strong>following.html</strong> in the extracted files.</p>
            </div>
          </div>
        </div>
        
        <div className={styles.tutorialNote}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Your data is processed entirely in your browser – ensuring complete privacy. No data is uploaded to any server.</p>
        </div>
        
        <motion.button 
          className={styles.actionButton}
          onClick={() => setShowTutorial(false)}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Got It
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className={styles.mainWrapper}>
      <FloatingNav activeSection="instagram-analyzer" />

      <div className={styles.analyzer}>
        {/* Background elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.gradientBlur1}></div>
          <div className={styles.gradientBlur2}></div>
          <div className={styles.grid}></div>
        </div>
        
        <div className={styles.container}>
          {/* Hero section */}
          <motion.div
            className={styles.hero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1>Instagram Follower Analyzer</h1>
            <p>Discover who isn't following you back with complete privacy and security.</p>
          </motion.div>

          <div className={styles.content}>
            <motion.div 
              className={styles.infoCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className={styles.iconContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <h2>How It Works</h2>
              <ol className={styles.instructionsList}>
                <li>
                  <span className={styles.step}>1</span>
                  <span className={styles.instruction}>
                    Visit Instagram and <strong>download your data</strong> in HTML format{' '}
                    <button 
                      className={styles.tutorialButton}
                      onClick={() => setShowTutorial(true)}
                    >
                      See How
                    </button>
                  </span>
                </li>
                <li>
                  <span className={styles.step}>2</span>
                  <span className={styles.instruction}>
                    Upload your <strong>followers.html</strong> and <strong>following.html</strong> files
                  </span>
                </li>
                <li>
                  <span className={styles.step}>3</span>
                  <span className={styles.instruction}>
                    Click <strong>Analyze</strong> to see who's not following you back
                  </span>
                </li>
              </ol>
              <div className={styles.privacyNote}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <p>Your files are processed entirely in your browser. No data is sent to any server, ensuring complete privacy.</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.formCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h2>Upload Your Files</h2>
              <form onSubmit={handleSubmit} className={styles.analyzerForm}>
                <div className={styles.fileInputs}>
                  <div className={styles.fileInput}>
                    <label>
                      <span>Followers HTML File</span>
                      <div className={styles.customFileInput}>
                        <input 
                          type="file" 
                          accept=".html, .htm" 
                          onChange={handleFollowersFileChange}
                          ref={followersInputRef}
                        />
                        <div className={styles.fileInputButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span>{followersFile ? 'Change File' : 'Choose File'}</span>
                        </div>
                        {followersFile && <p className={styles.fileName}>{followersFile.name}</p>}
                      </div>
                    </label>
                  </div>

                  <div className={styles.fileInput}>
                    <label>
                      <span>Following HTML File</span>
                      <div className={styles.customFileInput}>
                        <input 
                          type="file" 
                          accept=".html, .htm" 
                          onChange={handleFollowingFileChange}
                          ref={followingInputRef}
                        />
                        <div className={styles.fileInputButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span>{followingFile ? 'Change File' : 'Choose File'}</span>
                        </div>
                        {followingFile && <p className={styles.fileName}>{followingFile.name}</p>}
                      </div>
                    </label>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <motion.button 
                    type="submit" 
                    className={styles.analyzeButton}
                    disabled={isLoading || (!followersFile || !followingFile)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.spinner}></span>
                        <span>Analyzing</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 5H2v7l6 6 4-4-6-6zm10 14l-6-6 4-4 6 6V8h-7"></path>
                        </svg>
                        <span>Analyze</span>
                      </>
                    )}
                  </motion.button>
                  
                  {(followersFile || followingFile || results) && (
                    <motion.button 
                      type="button" 
                      className={styles.resetButton}
                      onClick={resetForm}
                      disabled={isLoading}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 2v6h6"></path>
                        <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                      </svg>
                      <span>Reset</span>
                    </motion.button>
                  )}
                </div>
              </form>

              {error && (
                <motion.div 
                  className={styles.error}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p>{error}</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Results section */}
          <AnimatePresence>
            {results && (
              <motion.div 
                className={styles.resultsContainer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <h2>Analysis Results</h2>
                <div className={styles.stats}>
                  <motion.div 
                    className={styles.stat}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.statValue}>{results.followingCount}</div>
                    <div className={styles.statLabel}>Following</div>
                  </motion.div>
                  
                  <motion.div 
                    className={styles.stat}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.statValue}>{results.followersCount}</div>
                    <div className={styles.statLabel}>Followers</div>
                  </motion.div>
                  
                  <motion.div 
                    className={`${styles.stat} ${styles.highlightStat}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.statValue}>{results.unfollowersCount}</div>
                    <div className={styles.statLabel}>Not Following Back</div>
                  </motion.div>
                </div>

                <div className={styles.unfollowersList}>
                  <h3>Accounts Not Following You Back</h3>
                  
                  {results.unfollowers.length > 0 ? (
                    <div className={styles.accountsGrid}>
                      {results.unfollowers.map((username, index) => (
                        <motion.div 
                          key={username} 
                          className={styles.accountCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + (index * 0.03), duration: 0.4 }}
                          whileHover={{ scale: 1.03, y: -3 }}
                        >
                          <div className={styles.accountInfo}>
                            <div className={styles.userAvatar}>
                              <div className={styles.avatarPlaceholder}>
                                {username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className={styles.userName}>@{username}</div>
                          </div>
                          <a 
                            href={`https://www.instagram.com/${username}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.profileLink}
                          >
                            View Profile
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noUnfollowers}>
                      <div className={styles.successIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <h4>Perfect Match!</h4>
                      <p>Good news! Everyone you follow also follows you back.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.copyright}>
              <p>© 2025 Anthony Zhou - All Rights Reserved</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/#about">About</Link>
              <Link href="/#work">Projects</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && <InstagramDataTutorial />}
      </AnimatePresence>
    </div>
  );
}