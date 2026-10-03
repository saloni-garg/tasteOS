# Publish this project on GitHub

1. Create an empty repository named `findwise` on GitHub. Do not initialize it with a README, license, or gitignore because these source files are already included.
2. Unzip the project and open a terminal inside the `findwise` folder.
3. Run the commands below, replacing `YOUR_USERNAME` with your GitHub username:

```sh
git init -b main
git add .
git status --short
# Check that .env.local and node_modules are absent from staged files.
git commit -m "Build FindWise personalized decision engine"
git remote add origin https://github.com/YOUR_USERNAME/findwise.git
git push -u origin main
```

Use your normal GitHub sign-in, SSH key, or credential manager when prompted. Never put sponsor API keys in a GitHub README, issue, or commit.

Suggested repository description:

> Persistent taste memory, AI-generated decision signals, and transparent personal ranking. Built with ZooWork, Tavily, Moss, and BAND.

Suggested topics: `hackathon`, `ai-agents`, `personalization`, `decision-support`, `tavily`, `typescript`, `react`.

GitHub stores the source. Publishing the repository does not deploy the app or grant access to the existing owner-private Site.
