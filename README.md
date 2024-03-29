## Social Network for Music

"Programmazione web e mobile" final exam assignment.

Deployed _(automatically)_ at [socialnetworkformusic.favo02.dev](https://socialnetworkformusic.favo02.dev) (or [snm.favo02.dev](https://snm.favo02.dev), a bit shorter).

## **Documentation**:

_In italian:_

- [Relazione](RELAZIONE.md) (contains both installation manual and technical documentation)

## Workflow

### Branching Strategy

<details>
<summary>Branching strategy</summary>

> This project follows the [GitHubFlow](https://docs.github.com/en/get-started/quickstart/github-flow) branching strategy.

> Following is a summary of a typical GitHubFlow workflow.

##### Create a branch

Create a branch in your repository. The branch name should be short and descriptive, for example: `increase-test-timeout` or `add-code-of-conduct`.

- If a branch targets a specific issue **the name of the branch should begin with the issue_id** e.g. `123-fix-users-endpoint`.

##### Make changes

On your branch, make the desired changes to the repository, then commit and push your changes to your branch.

When committing your changes, make sure to follow the guidelines described in the <a href="#commits">commits section</a>.

##### Create a pull request

When you create a pull request, **include a summary of the changes** and what problem they solve.

> Pull requests are the final part of this workflow and they allow contributors to **review and share opinions on code** with each other. Furthermore such mechanism opens the doors to **automated workflow runs** (continuous integration).

##### When to pull request

- A pull request should only be opened when the work is *done* and ready for production.

- If a pull request doesn't pass every automated test, **it shouldn't be merged**, fix the problems and then push your fixes again until it passes.

##### Merge your pull request

Once your pull request is approved, merge your pull request. This will automatically merge your branch so that your changes appear on the default branch.

##### Delete your branch

After you merge your pull request, **delete your branch**.
  
</details>

### Commit Convention

<details>
<summary>Commit convention</summary>

> This project follow the [AngularJS commit-message convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format), this increases consistency and readability of commits but more importantly it eases the creation of version numbers.

> Following is a summary of the conventional commits strategy, modified to fit the needs of this project.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: frontend|backend|controllers|middlewares|models|components|pages|services|utils
  │
  └─⫸ Commit Type: repo|build|docs|feat|fix|refactor|revert|bump
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

* **repo**: changes to the repository (ci, readme, gitignore, ...)
* **build**: changes that affect the build system or external dependencies (npm modules, ...)
* **docs**: documentation only changes (comments, ...)
* **feat**: a new feature
* **fix**: a bug fix
* **refactor**: a code change that neither fixes a bug nor adds a feature
* **revert**: revert a previous change
* **bump**: version bump

##### Scope

The scope is the part of the codebase where the changes happened and it can be one of the following:

* **frontend**: generic changes to frontend (`package.json`, `config`, ...)
* **backend**: generic changes to backend (`package.json`, `config`, ...)
* **controllers**: changes to controllers (backend)
* **middlewares**: changes to middlewares (backend)
* **models**: changes to models (backend)
* **components**: changes to components (frontend)
* **pages**: changes to routing or to entire pages (frontend)
* **services**: changes to services (frontend)
* **utils**: changes to utils functions or interfaces

- If none of the above matches the modified scope then the scope can be empty e.g. `fix: stuff that is not above`.

- If a commit changes multiple parts of the codebase then an `*` sign can be used as the scope specifier.

#### Commit Message Body

- Use imperative, present tense: “change” not “changed” nor “changes”.

- Include motivation for the change and contrasts with previous behavior.

#### Commit Message Footer

All breaking changes have to be mentioned in footer with the description of the change, justification and migration notes (e.g. `BREAKING CHANGE: desc...`).

- If a commit targets a specific issue, the issue_id must be specified in the footer e.g. `Closes #123`, in case of multiple issues `Closes #123, #124, #125`.
  
</details>

### Issues: bugs report, feature ideas
  
<details>
<summary>Issues: bugs report, feature ideas</summary>

> Issues can be opened for everything that has to do with the program, from asking questions to requesting new fetures or bug-fixes.

Issues should describe and include each of the following components:

- A `priority` label
    - `priority: 0` &larr; **Highest**
    - `priority: 1`
    - `priority: 2`
    - `priority: 3`
    - `priority: 4` &larr; **Lowest**
- A `type` label
    - `feature`: new feature to be implemented
    - `bug`: bug to be fixed
    - `idea`: an idea for a future update (not strictly required as a feature)

</details>

### Versioning and deploying
  
<details>
<summary>Versioning and deploying</summary>

#### Versioning

Versioning is done automatically by [GitVersion](https://gitversion.net) each time a PR is successfully merged into the `main branch`.

Based on the commit types, the action will increment minor (`0.minor.0`) or patch (`0.0.patch`) version number.\
Major (`major.0.0`) versions are generated manually
  
#### Deploying

Every time a new version is bumped, the `serve` workflow will be triggered, generating a new Docker image for the application and serving it at [snm.favo02.dev](https://snm.favo02.dev).

</details>
  

