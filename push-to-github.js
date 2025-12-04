import { Octokit } from '@octokit/rest'
import fs from 'fs';
import path from 'path';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function getFileContent(filePath) {
  return fs.readFileSync(filePath);
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.cache' || entry.name === '.local') {
      continue;
    }
    
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

async function createPullRequest() {
  const octokit = await getUncachableGitHubClient();
  const owner = 'tildenatmidnorth';
  const repo = 'codedeploytest';
  const baseBranch = 'main';
  const newBranch = 'update-black-theme-' + Date.now();
  
  console.log('Getting current commit from main...');
  
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`
  });
  const currentCommitSha = refData.object.sha;
  
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: currentCommitSha
  });
  const treeSha = commitData.tree.sha;
  
  console.log(`Creating new branch: ${newBranch}...`);
  
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${newBranch}`,
    sha: currentCommitSha
  });
  
  console.log('Building file tree...');
  
  const files = await getAllFiles('.');
  const treeItems = [];
  
  for (const file of files) {
    const content = await getFileContent(file);
    const { data: blobData } = await octokit.git.createBlob({
      owner,
      repo,
      content: content.toString('base64'),
      encoding: 'base64'
    });
    
    treeItems.push({
      path: file,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });
    console.log(`  Added: ${file}`);
  }
  
  console.log('Creating tree...');
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeSha,
    tree: treeItems
  });
  
  console.log('Creating commit...');
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message: 'Update: Change font and button colors to black',
    tree: newTree.sha,
    parents: [currentCommitSha]
  });
  
  console.log('Pushing to new branch...');
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${newBranch}`,
    sha: newCommit.sha
  });
  
  console.log('Creating pull request...');
  const { data: prData } = await octokit.pulls.create({
    owner,
    repo,
    title: 'Update: Change font and button colors to black',
    head: newBranch,
    base: baseBranch,
    body: 'This pull request updates the styling:\n\n- Changed H1 heading color from purple to black\n- Changed button background from purple to black\n- Updated message box border to black\n\nThese changes create a sleek black-and-white theme that complements the dark space background.'
  });
  
  console.log(`\nPull request created successfully!`);
  console.log(`PR #${prData.number}: ${prData.title}`);
  console.log(`URL: ${prData.html_url}`);
}

createPullRequest().catch(console.error);
