## 什么是git
> git是一个开源的分布式版本控制系统，用于高效处理任何或大或小的项目
> 使用一个特殊的叫做**仓库**的数据库来记录文件的变化
> **git是C语言开发的**

**仓库**
* 仓库中的每个版本都有一个完整的历史记录，可以看到谁在什么时间修改了哪些文件的哪些内容（`版本控制系统`）
* 在需要的时候还可以将文件回退到目标版本

**版本控制系统**
* 集中式  -- svn，cvs
   `使用简单；但是中央服务器出现故障，其他系统就都无法工作`
* 分布式 -- git
   `在本地修改，在仓库同步`
   

## 集中式与分布式

### 集中式

**工作原理**

所有的版本库是放在`中央服务器中`的，也就是说我们每一次的修改上传都是保存在中央服务器中的。中央服务器就是个大仓库，大家把产品都堆里面，每一次需要改进和完善的时候，需要去仓库里面把文件给提出来，然后再操作

**问题**

* 协同工作时可能造成的提交文件不完整，版本库损坏等问题，A提交，B也提交，C下载的时候可能得到的仅是A,B提交版本中的一部分
* 其次，集中式版本控制系统必须要联网才能工作，不论是局域网还是互联网，必须上网才能将本地版本推送至服务器进行保存


### 分布式管理系统

**工作原理**

分布的含义是指每台计算机上都有一个完整的版本库，这个时候，你的修改仅仅需要提交给本地的版本库进行保存就可以了
分布式版本控制系统中通常也会有一台充当“中央服务器”的计算机，大家都把版本推送到这台计算机上，而需要同步的人只需同步这一台固定的计算机就可以

## git的三个区域

* **工作区** -- 处理工作的区域；`在电脑里看到的目录`
* **暂存区** -- 临时存放的区域；`在.git文件内的index（二进制记录）`
* **本地git仓库/版本库** -- 最终的存放区域；`指的整个.git文件夹`

### 工作区 (Working Directory)

> 工作区是本地计算机上的项目目录，在这里进行文件的创建，修改和删除操作
> 工作区包含了当前项目的所有文件和子目录

* 显示项目的当前状态
* 文件的修改在工作区进行，但这些修改还没有被记录到版本控制中

### 暂存区 (Staging Area)

> 暂存区是一个临时存储区域，它包含了即将被提交到版本库的文件快照，在提交之前可以选择性将工作区的修改添加到暂存区

* 暂存区保存了将被包含在下一个提交中的更改
* 可以使用`git add`命令将文件添加到暂存区直至准备好提交所有更改

### 版本库 (Repository)

> 版本库包含项目的所有版本历史记录，每次提交都会在版本库中创建一个新的快照，这些快照是不可变的，以确保项目的完整历史记录

* 版本库分为`本地版本库和远程版本库`，这里主要指本地版本库
* 本地版本库存储在`.git`目录，包含了所有提交的对象和引用

### 三个区域的关系

* 工作区到暂存区
```git
git add filename
git add . // 添加目录下所有文件
```

* 暂存区到版本库
```git
git commit -m "commit"
```

* 版本库到本地版本库
```git
git push origin branch-name
```

* 远程仓库到本地版本库 `git pull / git fetch`
```git
git pull <远程主机名> <远程分支名>:<本地分支名>

git fetch <远程主机名> <远程分支名>:<本地分支名>
git merge <本地分支名>
```

**关于git pull 和 git fetch**
* `git fetch`是将远程主机的最新内容拉到本地，用户在检查了以后决定是否合并到工作本机分支中
* `git pull` 则是将远程主机的最新内容拉下来后直接合并，即：`git pull = git fetch + git merge`，这样可能会产生冲突，需要手动解决

* 相比起来，git fetch 更安全也更符合实际要求，在 merge 前，我们可以查看更新情况，根据实际情况再决定是否合并


## 命令

### 创建仓库 -- git init

```git
git init // 使用当前目录
git init newrepo // 新建newrepo目录为指定目录
```

* 初始化后，目标目录下会出现一个名为.git的目录，所有git需要的数据和资源都存放在这个目录中

### 拷贝项目 -- git clone

> git clone指令用于从现有Git仓库中拷贝项目（`类似svn checkout`）

```git
git clone <git仓库> <指定本地目录>
```

### 配置项目 -- git config

> git config命令用于打印/编辑git的配置信息

* 显示当前的git配置信息
```git
git config --list
```

* 编辑git配置文件
```git
git config -e // 仅针对当前仓库

git config -e --global // 针对系统上所有仓库
```

* 设置提交代码时的用户信息
```git
git config --global user.name "cy"
git config --global user.email.test@cy.com
```

**如果去掉--global参数 就只针对当前仓库有效**


### 基本操作

> Git 的工作就是创建和保存你项目的快照及与之后的快照进行对比
> Git 常用的是以下 6 个命令：**git clone**、**git push**、**git add** 、**git commit**、**git checkout**、**git pull**

#### HEAD

> 在 Git 里，`HEAD` 是一个十分关键的概念，它代表着当前所在的提交位置

**基本含义**

`HEAD` 本质上是一个指向当前分支上最新提交对象的引用。你可以把它想象成一个指针，这个指针指向当前工作目录所基于的提交。换而言之，`HEAD` 表明了你当前处于项目历史中的哪个位置


**HEAD的相对引用**

* 在 Git 中，你可以使用 `HEAD` 的相对引用进行快速定位。常见的相对引用符号有 `^` 和 `~`
     * HEAD^ -- ^读作caret；表示 `HEAD` 所指向提交的父提交
     * HEAD~n -- 表示 `HEAD` 所指向提交的第 `n` 代祖先提交

**分离HEAD状态**

* 分离 `HEAD` 状态指的是 `HEAD` 不再指向某个分支，而是直接指向一个具体的提交对象
* 在该状态中，`HEAD` 脱离了分支的控制，你可以在这个特定的提交上进行操作，比如查看历史版本、做一些临时的实验性修改等。不过要注意，在分离 `HEAD` 状态下创建的新提交不会关联到任何现有分支，除非你后续创建了新分支并将这些提交包含进去，否则这些提交可能会在后续操作中丢失

**分离HEAD状态回到正常分支**
```git
git checkout main
git switch main
```

**分离HEAD状态创建新分支**
如果你在分离 `HEAD` 状态下做了一些有用的提交，想要保存这些更改，可以创建一个新分支来包含这些提交

```git
git switch -c new-branch
```

#### commit-hash

> 在 Git 里，每次提交都会生成一个唯一的标识符，这个标识符就是 `commit-hash`

**获取方法 -- git log**
```git
git log --oneline
```

* 执行这个命令后，会输出简洁的提交历史，每行前面的字符串就是 `commit-hash` 的简写形式
* 如果需要完整的 `commit-hash`，可以去掉 `--oneline` 选项


#### 创建仓库

* **git init** -- 初始化仓库
* **git clone** -- 拷贝一份远程仓库，即下载一个项目

#### 修改与提交

##### git add -- 添加文件到暂存区

> **git add** 命令可将该文件的修改添加到暂存区
> 告诉 Git 哪些文件的修改应该包含在下一次提交（commit）中

* git add file1_name file2_name ：添加多个文件
* git add dir ：添加目录（包括子目录）
* git add . ：添加当前目录所有文件





##### git status -- 查看仓库当前的状态，显示有变更的文件

> **git status** 是一个用于查看 Git 仓库当前状态的命令
> **git status** 命令可以查看在你上次提交之后是否有对文件进行再次修改

**git status显示信息**

- 当前分支的名称。
- 当前分支与远程分支的关系（例如，是否是最新的）。
- 未暂存的修改：显示已修改但尚未使用 `git add` 添加到暂存区的文件列表。
- 未跟踪的文件：显示尚未纳入版本控制的新文件列表。

##### git diff -- 比较工作区，暂存区与版本库的差异

###### 情景一 -- 工作区与暂存区

> git diff命令，默认查看的就是工作区与暂存区的差异

* git diff ：查看工作区与暂存区之间所有文件的差异
* git diff -- file_name ：查看具体某个文件 在工作区和暂存区之间的差异
* git diff -- file1_name file2_name ：查看多个文件在工作区和暂存区之间的差异

###### 情景二 -- 工作区与版本库

**最新版本库**

* git diff HEAD ：查看工作区与最新版本库之间所有的文件差异
* * git diff HEAD -- file_name ：查看工作区与最新版本库之间的 指定文件名的文件差异
* git diff HEAD -- file1_name file2_name ：查看工作区与最新版本库之间的 指定文件名的多个文件差异

**指定版本库**

* git diff 某个具体版本 ：查看工作区与具体某个提交版本之间的所有的文件差异
* git diff 某个具体版本 file_name ：查看工作区与具体某个版本之间的 指定文件名的文件差异
* git diff 某个具体版本 -- file1_name file2_name ：查看工作区与最具体某个版本之间的 指定文件名的多个文件差异

###### 情景三 -- 暂存区与版本库

* git diff --cached : 查看暂存区和 上一次提交 的最新版本(HEAD)之间的所有文件差异
* git diff --cached 版本号 ： 查看暂存区和 指定版本 之间的所有文件差异
* git diff --cached -- 文件名1 文件名2 文件名3 ： 查看暂存区和 HEAD 之间的指定文件差异
* git diff --cached 版本号 -- 文件名1 文件名2 文件名3 ： 查看暂存区和 指定版本 之间的指定文件差异

###### 情景四 -- 查看不同版本库 之间文件的差异

* git diff 版本号1 版本号2 ： 查看两个版本之间的差异
* git diff 版本号1 版本号2 -- 文件名1 文件名2 ： 查看两个版本之间的指定文件之间的差异
* git diff 版本号1 版本号2 --stat : 查看两个版本之间的改动的文件列表
* git diff 版本号1 版本号2 src : 查看两个版本之间的文件夹 src (具名)的差异


##### git difftool -- 使用外部差异工具查看和比较文件的更改

> 是diff命令的扩展，提供了更直观的可视化工具来解决文件之间的差异，使用于那些更喜欢图形化工具而不是命令行工具来处理文件差异的用户

**命令组成**
* options -- 工具选项
* commit -- 指定要比较的提交，默认为当前工作目录的状态
* path -- 指定要比较的文件路径
```git
// 基本语法:
git difftool [<options>] [<commit> [<path>...]]
```

**常见选项 options**

| **选项**                 | **说明**                               | **用法示例**                            |
| ---------------------- | ------------------------------------ | ----------------------------------- |
| `--tool=<tool>`        | 指定使用的外部差异工具。默认情况下，Git 使用配置的默认差异工具。   | `git difftool --tool=meld`          |
| `--tool-help`          | 显示可用的差异工具列表。                         | `git difftool --tool-help`          |
| `--dir-diff`           | 在目录中进行比较，而不是逐个文件。                    | `git difftool --dir-diff`           |
| `--no-prompt`          | 跳过对每个文件的确认提示，自动使用工具查看差异。             | `git difftool --no-prompt`          |
| `--staged`             | 比较已暂存的更改与上一个提交之间的差异。                 | `git difftool --staged`             |
| `--cached`             | 与 `--staged` 相同，用于比较已缓存的更改与上一个提交的差异。 | `git difftool --cached`             |
| `--merge`              | 用于合并工具，处理冲突时查看差异。                    | `git difftool --merge`              |
| `--find-copies`        | 查找文件复制和移动。                           | `git difftool --find-copies`        |
| `--find-copies-harder` | 更加严格地查找文件复制和移动。                      | `git difftool --find-copies-harder` |
**配置差异工具 -- 结合git config**

```git
git config --global diff.tool meld

git config --global difftool.meld.cmd 'meld "$BASE" "$LOCAL" "$REMOTE" --diff "$MERGED"'
```

**配置difftool等价物**

* 如果尚未定义difftool等价物，则git difftool回退到git mergetool配置变量。

##### git range-diff -- 比较两个提交范围之间的差异

> git range-diff命令用于比较`两个提交范围`之间的差异。
> git range-diff命令与 git diff 类似，但允许你同时比较两个不同的提交范围，通常用于查看`一系列提交在不同分支或不同版本之间的变化`。
> **这对于代码审查和变更比较特别有用。**

**基本使用**

```git
git range-diff <old-range> <new-range>
```

* **`<old-range>`**：旧的提交范围或分支。
- **`<new-range>`**：新的提交范围或分支。

**范围表示**

提交范围可以用提交哈希、分支名称或者其他标识符表示。如果不指定参数，则默认使用当前分支的 HEAD

**常见用法**
* 比较两个分支的提交范围
```git
git range-diff branch1 branch2
```

* 比较两个提交系列
  `比较两个提交系列的差异，查看在特定时间段内的`
```git
git range-diff HEAD~10..HEAD~5 HEAD~5..HEAD
```
`这里，HEAD~10..HEAD~5 表示旧的提交范围，HEAD~5..HEAD 表示新的提交范围。`

##### git commit  -- 提交暂存区到本地仓库

> git commit命令将暂存区内容添加到本地仓库

**基本用法**

```git
git commit -m "message"
```

* message可以是一些备注信息

**提交指定文件**

```git
git commit [fileName] [fileName]...-m "message"
```

###### message参数

> `message` 参数通过 `-m` 选项指定；作用是为提交操作添加描述性的文本信息
> 帮助你和其他开发者快速了解此次提交的内容与目的

**不使用message参数**

* 在使用`git commit`命令时，`message`参数并非绝对必需，但建议始终提供有意义的提交信息
* 当你直接运行`git commit`而不添加`-m`选项时，Git 会打开默认的文本编辑器（如 Vim、Nano 等，具体取决于你的系统配置），让你在其中输入提交信息。在编辑器中输入完成后，保存并退出，提交操作才会完成
![](images/Snipaste_2025-04-17_13-11-52.jpg)

**多行描述信息**

* 多次使用 `-m` 选项
```git
git commit -m "line1" -m "line2"
```

* 使用git commit指令 在默认的文本编辑器输入多行提交信息


###### -a参数

* -a参数是 `--all` 的简写
* 当你在 `git commit` 命令中使用 `-a` 参数时，Git 会自动把所有已经被跟踪（即之前已经添加到版本控制中的文件）且发生了修改或者删除操作的文件添加到暂存区，然后进行提交
* 但要注意，它不会处理那些`新创建的、尚未被 Git 跟踪的文件`

**注意**
- **适用场景**：当你对多个已跟踪文件进行了修改，并且希望一次性提交所有这些修改时，使用 `-a` 参数可以节省时间和精力，避免逐个添加文件到暂存区的繁琐操作。
- **局限性**：`-a` 参数只对已跟踪的文件有效，对于新创建的文件，你仍然需要使用 `git add` 命令将其添加到版本控制中，然后才能进行提交。
- **谨慎使用**：在使用 `-a` 参数时，要确保你清楚所有已跟踪文件的修改情况，因为它会将所有修改一并提交，可能会把一些你不希望提交的更改也包含进去。如果有部分修改不想提交，可以使用 `git add` 只添加特定的文件或使用 `git reset` 撤销暂存区的修改。





##### git reset -- 回退版本

> git reset命令用于回退版本，可以指定退回到某一次提交的版本

**基础使用**
```git
git reset [--soft | --mixed | --hard] [HEAD]
```

**关于参数选项**
* `--mixed `表示默认，可以`不用携带参数，`用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变

```git
git reset HEAD^ // 回退所有内容到上一个版本
git reset HEAD^ hello.md // 回退hello.md文件的版本到上一个版本
git reset 0444 // 回退到指定版本
```

* `--soft` 参数用于回退到某个版本

```git
git reset HEAD~3 // 回退到上上上个版本
```

* `-hard` 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交

```git
git reset --hard HEAD~3  # 回退上上上一个版本  
git reset –-hard bae128  # 回退到某个版本回退点之前的所有信息。 
git reset --hard origin/master    # 将本地的状态回退到和远程的一样 
```

**git reset HEAD**
* 取消之前使用 `git add` 命令添加到暂存区的内容，将文件从暂存区移除，但不会影响工作区中文件的实际内容

##### git rm -- 将文件从暂存区和工作区移除

> git rm命令用于删除文件；
> 如果只是简单的从工作目录删除文件，运行git status时会提示`Changes not staged for commit`

**git rm删除文件的形式**

* 将文件从暂存区和工作区删除
  `会把这个删除操作记录下来，下次提交时，这个文件的删除会成为提交内容的一部分`
```git
git rm file_name
```

* -f参数 强制删除
  `如果删除之前已经修改但没有提交到暂存区 需要使用强制删除选项-f`
  `因为 Git 认为这种情况下你可能还需要保留这些修改，所以会给出提示，避免你误删重要数据`
```git
git rm -f file_name
```

* -cached参数 仅是从跟踪清单中删除
  `想把文件从暂存区域移除，但仍然希望保留在当前工作目录中`
```git
git rm -cached file_name
```

* 递归删除 
  `如果后面跟的是一个目录做为参数，则会递归删除整个目录中的所有子目录和文件`
```git
git rm -r directory_name

git rm --recursive directory_name
```

##### git mv -- 移动或重命名工作区文件

> git mv命令用于移动或重命名一个文件，目录或软连接
> git mv命令直接影响工作区；还会自动更新暂存区的内容

**重命名**
* 基础使用
```git
git mv file_name new_file_name
```

* 强制改名 -- 强制覆盖已存在同名目标文件或目录
```git
git mv -f file_name new_file_name
```

**移动文件位置**
* 基础使用
```git
git mv file_name directory/
```

* 强制移动 -- 强制覆盖目录下已经的同名文件
```git
git mv -f file_name directory/
```

##### git notes -- 添加注释

> git notes命令允许用户将附加注释添加到提交中
> `注释不会修改提交的内容，而是附加到提交的元数据中，便于记录额外的信息，如审查备注、额外说明等`

**基础使用**
```git
git notes <subcommand> [options] [arguments]
```

* < subcommand > -- 具体的操作子命令（如 `add`, `show`, `list`, `remove`, `edit`, `merge` 等）
* [ opttions ] -- 命令的选项或参数
* [ arguments ] -- 命令的附加参数，人提交哈希值等

**添加注释**
```git
git notes add -m "message" // 添加注释到当前提交
git notes add -m "message" <commit-hash> // 添加注释到特定提交
```

**查看注释**
```git
git notes show <commit-hash>
```

**列出所有注释**
```git
// 列出当前分支上所有提交的注释
git notes list
```

**删除注释**
```git
// 删除特定提交的注释
git notes remove <commit-hash>

// 删除所有注释（不常用）
git notes remove
```

**修改注释**
```git
// 修改当前提交的注释
git notes edit
```

**推送和拉取注释**
```git
// 推送注释到远程仓库
git push origin refs/notes/*

// 拉取远程注释
git fetch origin refs/notes/*:refs/notes/*
```

##### git checkout -- 切换分支

> git checkout命令用于在不同的分支之间切换，恢复文件，创建新分支等操作

**切换分支**
```git
git checkout branch-name
```

**创建新分支并切换**
```git
git checkout -b branch-name
```

**切换到前一个分支**
```git
git checkout -
```

**检出文件**
`可以将工作区指定文件 <file> 恢复到最近一次提交时的状态，丢弃所有未提交的更改，这对于撤销不需要的更改非常有用`
```git
git checkout <file>
```

**切换到特定提交**
`你可以使用提交的哈希值 <commit-hash> 来切换到特定的提交状态。这将使你进入"分离头指针"状态，只能查看历史记录，而不能进行分支操作`
```git
git checkout <commit-hash>
```

**切换到标签**
```git
git checkout tags/<tag-name>
```

##### git switch -- 更加清晰的切换分支

> Git 2.23引入
> **git switch** 命令用于更清晰地切换分支
> **git switch** 命令作用与 git checkout 类似，但提供了更清晰的语义和错误检查

**切换分支**
```git
git switch <branch-name>
```

**创建新分支并切换**
```git
git switch -c <new-branch-name>
```

**切换到前一个分支**
```git
git switch -
```

**切换到特定状态**
```git
git switch <commit-hash>
```

**常用参数**
* -c / --create
  `穿件一个新的分支并切换到该分支`
* -C / --force-create
  `强制创建分支，重置并切换同名分支`
* -d / --depth
  `切换到分离HEAD状态，直接指向指定的提交，而不是依附于某个分支`
* --guess
  `当省略分支名时，Git 会尝试猜测你想要切换到的分支。通常它会尝试切换到与当前检出的文件匹配的上游分支`
* -f / --force
  `强制切换分支，即使当前分支有未提交的更改。使用该参数时要谨慎，因为可能会导致未保存的工作丢失`

##### git restore -- 恢复或撤销文件的修改

> Git 2.23版本引入
> 用于简化和改进文件恢复操作，相比于旧的命令（如 `git checkout` 和 `git reset`），它更专注于恢复文件内容和工作区状态
> 可以恢复工作区和暂存区中的文件，也可以用于丢弃未提交的更改

**基础用法**
```git
git restore options pathspec
```

* options -- 用于定制恢复行为的选项
* pathspec -- 要恢复文件或目录路径

**恢复工作区文件** -- 将工作区中的文件恢复到暂存区的状态
```git
git restore file_name
git restore -W file_name // 让命令意图更清晰
```

**恢复暂存区文件** -- 将暂存区中的文件恢复到 `HEAD` 所指向的提交版本
```git
git restore --staged file_name
```

**恢复暂存区文件 特定版本**
```git
git restore --source=ab123 file_name
```

**合并冲突**
* 恢复文件的“我们”版本
```git
git restore --ours file_name
```
 * 恢复文件的“他们”版本
```git
git restore --theirs file_name
```

##### git show -- 显示Git对象的详细信息

> `git show` 命令用于查看提交、标签、树对象或其他 Git 对象的内容
> 这个命令对于审查提交历史、查看提交的具体内容以及调试 Git 对象非常有用

**显示提交的详细信息**
```git
git show <commit-hash>
```

**显示提交中包含的差异**
```git
git show --patch <commit-hash>
```

**显示提交中更改的文件名**
```git
git show --name-only <commit-hash>
```

**显示提交的统计信息**
```git
git show --stat <commit-hash>
```

#### 提交日志

##### git log -- 查看历史提交记录

> 查看 Git 提交历史可以帮助你了解代码的变更情况和开发进度
> Git 提供了多种命令和选项来查看提交历史，从简单的日志到详细的差异对比

**基本使用**
```git
git log [选项] [分支名/提交哈希]
```

* 不使用选项 -- 打印详细信息
* --oneline -- 以简介的一行格式显示提交信息
![](images/Snipaste_2025-04-17_15-40-45.jpg)

* --graph -- 以图形化形式显示分支和合并历史
![](images/Snipaste_2025-04-17_15-39-51.jpg)

* --reverse ：逆向显示所有日志

* 限制显示的提交数 -- git log -n < number >
* 显示自指定日期之后的提交 -- git log --since="2024-01-01"
* 显示指定日期之前的提交 -- git log --until="2024-07-01"
* 只显示某个作者的提交 -- git log --author="Author Name"
##### git blame -- 以列表形式查看指定文件的历史修改记录

> **git blame** 命令用于逐行显示指定文件的每一行代码是由谁在什么时候引入或修改的。
> **git blame** 可以追踪文件中每一行的变更历史，包括作者、提交哈希、提交日期和提交消息等信息。
> 如果要查看指定文件的修改记录可以使用 git blame 命令

**基础使用**
```git
git blame [选项] <文件路径>
```

**常用选项**
- `-L <起始行号>,<结束行号>`：只显示指定行号范围内的代码注释。
- `-C`：对于重命名或拷贝的代码行，也进行代码行溯源。
- `-M`：对于移动的代码行，也进行代码行溯源。
- `-C -C` 或 `-M -M`：对于较多改动的代码行，进行更进一步的溯源。
- `--show-stats`：显示包含每个作者的行数统计信息。


##### git shortlog -- 生成简介的提交日志概要

> `git shortlog` 命令用于生成简洁的提交日志摘要，按作者和提交消息进行归类



##### git describe -- 生成一个基于Git的标签系统来描述当前提交的字符串

#### 远程操作

##### git remote -- 远程仓库操作

> **git remote** 命令用于用于管理 Git 仓库中的远程仓库。
> **git remote** 命令提供了一些用于查看、添加、重命名和删除远程仓库的功能

- `git remote`：列出当前仓库中已配置的远程仓库。
- `git remote -v`：列出当前仓库中已配置的远程仓库，并显示它们的 URL。
- `git remote add <remote_name> <remote_url>`：添加一个新的远程仓库。指定一个远程仓库的名称和 URL，将其添加到当前仓库中。
- `git remote rename <old_name> <new_name>`：将已配置的远程仓库重命名。
- `git remote remove <remote_name>`：从当前仓库中删除指定的远程仓库。
- `git remote set-url <remote_name> <new_url>`：修改指定远程仓库的 URL。
- `git remote show <remote_name>`：显示指定远程仓库的详细信息，包括 URL 和跟踪分支。




##### git fetch -- 从远程获取代码库

**基础用法**
```git
git fetch https://github...
```

**结合merge**
该命令执行完后需要执行 git merge 远程分支同步到你所在的分支
```git
git merge origin/master
```

##### git pull -- 下载远程代码并合并

> **git pull** 其实就是 git fetch 和 git merge 的简写，先从远程仓库获取最新的提交记录，然后将这些提交记录合并到你当前的分支中

**基础使用**
将远程主机 origin 的 master 分支拉取过来，与本地的 brantest 分支合并
```git
git pull origin master:brantest
```

##### git push -- 上传远程代码并合并

**基础使用**
```git
git push <远程主机名> <本地分支名>:<远程分支名>
```
*  如果本地分支名与远程分支名相同，则可以省略冒号和远程分支名
##### git submodule -- 管理包含其他Git仓库的项目

> `git submodule` 命令用于管理包含其他 Git 仓库的项目。
> `git submodule` 命令对于大型项目或需要将外部库集成到项目中的情况非常有用。 通过使用子模块，你可以将外部库作为你的项目的一部分来管理，而不必将其直接合并到主仓库中

**基础使用**
```git
// 初始化子模块 -- 在子模块中操作
git clone <repo-url>
git submodule init

// 更新子模块 -- 在子模块中操作
git submodule update

// 添加子模块 -- 在父模块中操作
git submodule add https://github.com/example/libfoo.git libfoo

// 移除子模块
git submodule deinit [<path>]
git rm [<path>]

// 列出子模块
git submodule
```

### 分支管理
> Git 分支管理是 Git 强大功能之一，能够让多个开发人员并行工作，开发新功能、修复 bug 或进行实验，而不会影响主代码库

**Git 分支实际上是指向更改快照的指针。**

#### 创建分支

```git
git checkout -b new_branch
```

#### 查看分支

* 查看所有本地分支
```git
git branch
```

* 查看所有远程分支
```git
git branch -r
```

* 查看所有本地和远程分支
```git
git branch -a
```

#### 合并分支

* 将其他分支合并到当前分支
```git
git merge <branchName>
```

#### 解决合并冲突

> 当合并过程中出现冲突时，Git 会标记冲突文件，你需要手动解决冲突。

* 打开冲突文件，按照标记解决冲突
* 标记冲突解决完成
* git add 冲突文件
* git commit

#### 删除分支

* 删除本地分支
```git
git branch -d branch_name
```

* 强制删除未合并的分支
```git
git branch -D branch_name
```

* 删除远程分支
```git
git push origin --delete branch_name
```




### 快捷操作

* 退出git diff  -- q+回车
* 清屏( 视口屏，实际只是将当前行提到滚轮之前 ) -- ctrl+L

### Git标签

> 如果你达到一个重要的阶段，并希望永远记住提交的快照，你可以使用 git tag 给它打上标签
> Git 标签（Tag）用于给仓库中的**特定提交**点加上标记，通常用于**发布版本**

**标签注解 ：-a**
* **-a 选项意为**"创建一个带注解的标签"，不用 -a 选项也可以执行的，但它不会记录这标签是啥时候打的，谁打的，也不会让你添加个标签的注解，我们推荐一直创建带注解的标签

**标签语法格式**
```git
git tag -a v1.0

git tag -a // 打开编辑器添加标签
```

#### 追加标签

> 如果我们忘了给某个提交打标签，又将它发布了，我们可以给它追加标签。

```git
git tag -a v0.9 <commit-hash>
```

#### 查看所有标签

```git
git tag

git log -- decorate
```

#### 推送标签到远程仓库

> 默认情况下，git push 不会推送标签，你需要显式地推送标签。

```git
// 推送所有标签
git push origin --tags
```

#### 删除标签

* 本地删除
```git
git tag -d tag_name
```

* 远程删除
```git
git push origin --delete tag_name
```


#### 附注标签

> 附注标签存储了创建者的名字、电子邮件、日期，并且可以包含标签信息。附注标签更为正式，适用于需要额外元数据的场景
> 

##### 添加

```git
git tag -a <tag_name> -m "message"
```


##### 查看

```git
git show tag_name
```

##### 删除

```git
同上
```











