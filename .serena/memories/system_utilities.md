# System Utilities & Commands (macOS/Darwin)

## File System Operations
```bash
ls -la                    # List files with details
find . -name "*.ts"       # Find TypeScript files
grep -r "searchterm" .    # Search text in files recursively
cd path/to/directory      # Change directory
mkdir -p path/to/dir      # Create directory structure
cp -r source dest         # Copy directory recursively
mv source dest            # Move/rename files
rm -rf directory          # Remove directory recursively
```

## Git Operations
```bash
git status               # Check working tree status
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to remote
git pull                 # Pull from remote
git branch               # List branches
git checkout -b feature  # Create and switch to branch
git merge branch         # Merge branch
git log --oneline        # Compact commit history
```

## Process Management
```bash
ps aux | grep node       # Find Node.js processes
kill -9 PID             # Force kill process
lsof -i :3333           # Check what's using port 3333
pkill -f "sanity dev"   # Kill processes by name
```

## Network & Development
```bash
curl -I https://url.com     # HTTP headers check
ping google.com             # Network connectivity test
open http://localhost:3333  # Open URL in default browser
```

## File Permissions (macOS specific)
```bash
chmod +x script.sh       # Make script executable
chmod 755 directory      # Set directory permissions
sudo chown user:group file # Change file ownership
```

## Package Management
```bash
npm install              # Install dependencies
npm ci                   # Clean install (production)
npm outdated            # Check for updates
npm audit               # Security audit
npm run [script]        # Run package.json script
```

## Development Server Management
```bash
# Kill processes on specific ports
lsof -ti:3333 | xargs kill -9  # Kill Sanity dev server
lsof -ti:4321 | xargs kill -9  # Kill Astro dev server

# Background processes
npm run dev &            # Run in background
fg                       # Bring to foreground
jobs                     # List background jobs
```

## macOS Specific
```bash
pbcopy < file.txt        # Copy file content to clipboard  
pbpaste > file.txt       # Paste clipboard to file
open .                   # Open current directory in Finder
say "Build complete"     # Text-to-speech notification
```