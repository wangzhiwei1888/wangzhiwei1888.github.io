
---
title: 准备
date: 2026-04-27 11:18:14
tags:
categories:
  - 面试准备
  - FE
---

好的，我把附件内容调整为**中文在上，英文在下**的格式，重新输出给你。

---

你好，我是xxx。
Hello, I'm xxx.

我做前端开发已经超过10年了。
I've been a frontend developer for over 10 years.

我专注于搭建高性能网站、提升团队效率、以及优化页面加载速度。
I focus on building fast websites, making teams work faster, and fixing slow pages.

我最近的三份工作是：
My last three jobs were:

---

**通明智云（2024-2026）：**
**Tongming Zhiyun (2024-2026):**

我用 React 和微前端技术设计了整套前端系统。
I designed the whole frontend system using React and micro-frontend tech.

首屏加载原来需要 4.2 秒。
The first page used to take 4.2 seconds to show up.

我把它优化到了 1.1 秒。
I cut it down to 1.1 seconds.

我还搭建了自动部署：代码一推送，3 分钟内就上线。
I also set up auto-deploy: push code, and it's live in 3 minutes.

我的 CI/CD 流水线基于 Git + Jenkins + Docker：代码提交后自动触发 lint → 单元测试 → 构建 → Docker 镜像 → 部署到测试环境。
My CI/CD pipeline uses Git + Jenkins + Docker: code commit triggers lint → unit test → build → Docker image → deploy to staging.

我还用 Nginx 做反向代理和静态资源缓存，配合 Artifactory 管理构建产物。
I also used Nginx for reverse proxy and static asset caching, with Artifactory for build artifact management.

构建失败会自动触发 Slack 告警，并保留最近 3 个镜像用于回滚。
Failed builds trigger Slack alerts and retain the last 3 images for rollback.

---

**新奥集团（2021-2024）：**
**ENN Group (2021-2024):**

我负责一个嵌入 WebView 的移动端数据可视化项目，用 JS Bridge 与原生层通信，实现实时数据推送和手势交互。
I worked on a mobile data visualization project embedded in WebView, using JS Bridge to communicate with the native layer for real-time data push and gesture handling.

为了保持 60fps 流畅度，我采用了 Canvas 分层渲染——把静态背景、动态数据点和交互层分开，避免每帧全量重绘。
To maintain 60fps, I used Canvas layered rendering — separating static background, dynamic data points, and interaction layers to avoid full redraws every frame.

在新奥集团设计组件库时，我就考虑了从 PC 大屏到手机小屏的响应式适配。
When designing the component library at ENN Group, I considered responsive adaptation from large PC screens to mobile.

针对移动端兼容性，我处理过 iOS Safari 的 300ms 点击延迟、Android WebView 的弹性滚动冲突、以及不同浏览器对 CSS 变量的支持差异。
For mobile compatibility, I handled iOS Safari's 300ms click delay, Android WebView elastic scroll conflicts, and CSS variable support differences across browsers.

---

**京东金融（2017-2021）：**
**JD Finance (2017-2021):**

我重构了核心的转账页面——这是最敏感的用户流程，对稳定性和性能要求极高。
I rebuilt the core money transfer pages — the most sensitive user flow where stability and performance are critical.

在前端安全方面，我关注 XSS 防御（输入过滤、CSP 策略）、CSRF 防护（Token 验证）、以及敏感数据加密传输。
On frontend security, I focus on XSS prevention (input sanitization, CSP policies), CSRF protection (token validation), and encrypted transmission of sensitive data.

我确保所有用户输入都经过严格校验，支付相关接口都有双重验证。
I ensured all user inputs were strictly validated and payment APIs had dual verification.

我还做了一个检测页面性能的工具。
I also made a tool that checks if pages are slow.

它监控了 610 个页面，整体性能提升了 30%。
It watched 610 pages and made them 30% faster.

我因此获得了奖项。
I got an award for this.

---

我的优势：把技术工作转化为真实的业务成果。
What I'm good at: I turn tech work into real business results.

以上就是我。
That's me.

感谢您的时间！
Thanks for your time!

---

## 技术问答（中文在上，英文在下）

---

**Q1: iOS Safari 的 300ms 点击延迟是什么？**
**Q1: What is iOS Safari's 300ms click delay?**

在早期的 iOS Safari 中，当用户点击一个可点击的元素时，浏览器会等待 300ms 才触发 click 事件。这个延迟存在是因为 Safari 需要判断用户是单击还是双击（用于缩放）。如果 300ms 内用户没有再次点击，才会触发 click。这让移动端网页应用感觉很卡顿、不跟手。
In early versions of iOS Safari, when a user tapped a clickable element, the browser would wait 300ms before triggering the click event. This delay existed because Safari needed to determine whether the user was doing a single tap or a double-tap (to zoom). If the user didn't tap again within 300ms, it would fire the click. This made mobile web apps feel sluggish and unresponsive.

解决方案通常是添加 meta viewport 并设置 width=device-width, initial-scale=1（在现代 iOS 上会禁用双击缩放），或者在 CSS 中使用 touch-action: manipulation，又或者改用 touchstart 事件，借助 FastClick 等库来处理。
The fix is usually adding meta viewport with width=device-width, initial-scale=1 (which disables double-tap zoom on modern iOS), or using touch-action: manipulation in CSS, or switching to touchstart events with libraries like FastClick.

---

**Q2: Android WebView 的弹性滚动是什么？**
**Q2: What is elastic scroll in Android WebView?**

Android WebView 的弹性滚动（也叫"过滚动"或"橡皮筋效果"）是指当用户滚动到页面顶部或底部边缘时，内容会有一个拉伸然后回弹的视觉效果，像橡皮筋一样。虽然在原生应用里看起来不错，但在网页应用里会出问题——比如整个 WebView 都会弹动，而不是只有内部的可滚动区域，这会破坏预期的滚动行为，让应用显得不专业。
Elastic scroll (also called "overscroll" or "rubber-band effect") in Android WebView refers to the visual bounce effect when a user scrolls past the top or bottom edge of a web page. The content appears to stretch and then snap back, like a rubber band. While this looks nice in native apps, it can cause problems in web apps — for example, the entire WebView might bounce instead of just the inner scrollable area, breaking the expected scroll behavior and making the app feel unprofessional.

处理方式通常是使用 -webkit-overflow-scrolling: touch 配合 overflow-scrolling 设置来禁用弹性效果，或者在 JavaScript 中拦截触摸事件，当滚动到达边界时阻止默认的弹性行为。
To handle this, developers often disable the overscroll effect using -webkit-overflow-scrolling: touch combined with overflow-scrolling settings, or by intercepting touch events in JavaScript to prevent the default elastic behavior when the scroll boundary is reached.

---

**Q3: 不同浏览器对 CSS 变量（CSS Custom Properties）的支持差异有哪些？**
**Q3: What are the browser support differences for CSS variables (CSS Custom Properties)?**

CSS 变量（官方叫 CSS 自定义属性，语法是 --primary-color: blue 这种）在不同浏览器中的支持程度不一样。现代版的 Chrome、Firefox、Safari、Edge 都完全支持。但老浏览器比如 IE11 完全不支持。即使在现代浏览器之间也有细微差异：老版本 Safari 有个 bug，CSS 变量在 @media 查询里不生效；一些 Android WebView 版本（特别是 Android 4.x-5.x 的老设备）支持不完整或者有 bug；旧版 Edge（非 Chromium 内核版本）在 ::before、::after 等伪元素中使用 CSS 变量时会有问题。
CSS variables (officially called CSS Custom Properties, syntax like --primary-color: blue) have varying levels of support across browsers. Modern Chrome, Firefox, Safari, and Edge all support them fully. However, older browsers like Internet Explorer 11 do not support CSS variables at all. Even among modern browsers, there are subtle differences: Safari had a bug where CSS variables didn't work inside @media queries in older versions; some Android WebView versions (especially on older Android 4.x-5.x devices) had partial or buggy support; and Edge (the old non-Chromium version) had issues with CSS variables in pseudo-elements like ::before and ::after.

实际工作中，这意味着你需要兜底策略：要么提供静态回退值（比如 color: blue; color: var(--primary-color)），要么用 PostCSS 等构建工具把变量编译给老浏览器，或者对使用旧设备的用户接受优雅降级。
In practice, this means you need fallback strategies: either provide static fallback values (e.g., color: blue; color: var(--primary-color)), use a build tool like PostCSS to compile variables for older browsers, or accept graceful degradation for users on legacy devices.

---

## 通明智云 (Tongming Zhiyun)

---

**Q1: 你是怎么把首屏加载时间从4.2秒优化到1.1秒的？哪项优化贡献最大？**
**Q1: How did you optimize the first-screen load time from 4.2s to 1.1s? What was the biggest win?**

我采用了逐步优化的方法。首先，基于路由的懒加载通过代码分割减少了约1.2秒。其次，Gzip压缩又节省了0.8秒。第三，把静态资源放到CDN减少了0.5秒。最大的贡献其实是代码分割加上预加载——它把初始JS负载减少了60%。
I used a step-by-step approach. First, route-based lazy loading cut about 1.2 seconds by splitting the bundle. Second, Gzip compression saved another 0.8 seconds. Third, moving static assets to CDN reduced 0.5 seconds. The biggest win was actually code splitting combined with prefetching — it reduced the initial JS payload by 60%.

---

**Q2: 你为什么选择qiankun做微前端？它解决了什么问题？**
**Q2: Why did you choose qiankun for micro-frontend? What problems did it solve?**

我们有3个前端团队开发不同模块。用qiankun之前，他们共用一个代码库，发布经常冲突。qiankun让每个团队有自己的仓库，独立部署。它解决的核心问题是并行开发——团队可以按自己的节奏发布，互不干扰。
We had 3 frontend teams working on different modules. Before qiankun, they shared one codebase and deployments often conflicted. Qiankun let each team own their repo and deploy independently. The main problem it solved was parallel development — teams could release on different schedules without breaking each other.

---

**Q3: 拿到Lighthouse 89分最难的部分是什么？你怎么优化CLS的？**
**Q3: What was the hardest part in achieving Lighthouse 89? How did you improve CLS?**

最难的是INP（交互到下一次绘制）。LCP和CLS相对好修，但INP需要拆分长任务。我用了React的并发特性，把重计算拆成小片段。CLS方面，我给图片和广告加了固定尺寸，在动态内容加载前就预留好空间。
The hardest part was INP (Interaction to Next Paint). LCP and CLS were easier to fix, but INP required breaking long tasks. I used React's concurrent features and split heavy computations into smaller chunks. For CLS, I added fixed dimensions to images and ads, and reserved space for dynamic content before it loaded.

---

**Q4: 说说你的3分钟CI/CD流水线。如果构建失败怎么办？**
**Q4: Tell me about your 3-minute CI/CD pipeline. What happens if a build fails?**

流水线有5步：代码检查→单元测试→构建→Docker镜像→部署到测试环境。每步都有缓存。任何一步失败，流水线就停止并在Slack通知团队。我们保留最近3个Docker镜像作为回滚目标。失败的构建永远不会到生产环境。
The pipeline has 5 steps: lint → unit test → build → Docker image → deploy to staging. Each step is cached. If any step fails, the pipeline stops and alerts the team on Slack. We keep the last 3 Docker images as rollback targets. A failed build never reaches production.

---

**Q5: 为什么选Formily 2？比其他表单方案优势在哪？**
**Q5: Why Formily 2? What advantages over other form solutions?**

我们选Formily是因为有非常复杂的表单，带嵌套逻辑和动态字段。Formily的JSON Schema方式让后端定义表单结构，前端只负责渲染。这使表单开发时间减少了50%，因为产品经理调整字段不需要前端写代码。
We chose Formily because we had very complex forms with nested logic and dynamic fields. Formily's JSON Schema approach let backend define form structures, and frontend just rendered them. This cut form development time by 50% because product managers could adjust fields without frontend coding.

---

## 京东金融 (JD Finance)

---

**Q6: 你怎么从零设计SCAN平台的？架构是什么样的？**
**Q6: How did you design the SCAN platform from scratch? What was the architecture?**

SCAN分三层：数据采集、分析和报告。采集层用Puppeteer每天对610个页面跑Lighthouse扫描。数据存在Elasticsearch里。分析层把分数和基线对比。报告层给团队发告警，并生成每周趋势报告。
SCAN had 3 layers: data collection, analysis, and reporting. For collection, I used Puppeteer to run Lighthouse scans on 610 pages daily. Data went to Elasticsearch. Analysis layer compared scores against baselines. Reporting layer sent alerts to teams and generated weekly trend reports.

---

**Q7: 你怎么说服4个部门接入SCAN的？遇到阻力了吗？**
**Q7: How did you convince 4 departments to adopt SCAN? Any resistance?**

有的，一些团队觉得这是额外负担。我的解决办法是把性能分数纳入他们的季度KPI。我还给每个团队做了专属仪表盘，只显示他们自己的页面。当财富管理部门看到他们的LCP一个月下降了35%，其他团队主动要求加入。
Yes, some teams saw it as extra work. I solved this by making performance scores part of their quarterly KPIs. I also gave each team a dedicated dashboard showing only their pages. When wealth management saw their LCP drop by 35% in one month, other teams asked to join voluntarily.

---

**Q8: 在这个年度优秀项目中，你的具体贡献是什么？**
**Q8: What was your specific contribution to the Annual Outstanding Project Award?**

我是技术负责人。我设计了整个架构，搭建了核心扫描引擎，写了性能基线算法。我还亲自接入了前两个部门。团队共5人：2前端、2后端、1测试。我负责协调所有技术决策。
I was the tech lead. I designed the whole architecture, built the core scanning engine, and wrote the performance baseline algorithms. I coordinated all technical decisions.

---

**Q9: 你怎么把故障发现时间从小时级缩短到分钟级的？**
**Q9: How did you reduce incident detection time from hours to minutes?**

我用错误边界和遥测追踪搭建了前端监控系统。错误在组件层面被捕获，实时发送到日志平台。以前要靠用户报bug。之后我们2分钟内就能收到告警，经常在用户察觉之前。
I built a frontend monitoring system using Error Boundaries and telemetry tracking. Errors were caught at the component level and sent to our logging platform in real time. Before this, users had to report bugs. After, we got alerts within 2 minutes, often before users noticed.

---

## 新奥集团 (ENN Group)

---

**Q10: 千万级数据下，你怎么做到60fps的？**
**Q10: How did you achieve 60fps with tens of millions of records?**

我用了Canvas分层渲染。背景网格是静态的，只画一次。数据点放在单独一层，只有数据变化时才重画。交互层（悬停、点击）是第三层。这样避免了每帧都重画所有内容。我还加了细节层次——缩小时显示更少的点。
I used canvas layered rendering. The background grid was static — drawn once. Data points went to a separate layer, only redrawn when data changed. Interaction layer (hover, click) was a third layer. This avoided redrawing everything on every frame. I also added level-of-detail — show fewer points when zoomed out.

---

**Q11: 你做过的最复杂的仪表盘是什么样的？怎么设计的？**
**Q11: What was the most complex dashboard you built? How did you design it?**

我做过的最复杂的仪表盘是给一家能源公司做的实时数据监控系统。它需要展示来自几千个传感器的数据，每秒都在更新。
我把它设计成了三层：最底层用 Canvas 做主要的数据可视化，这样高频更新不会卡顿；中间一层用 DOM 放 UI 控件和文字，这些不需要频繁刷新；最上面一层用 WebSocket 做实时数据推送。这样分开处理之后，即使数据量很大，帧率也能稳定在 60fps。
The most complex dashboard I built was a real-time data monitoring system for an energy company. It had to display data from thousands of sensors updating every second.
I designed it with three layers: a Canvas layer for the main data visualization to handle high-frequency updates smoothly, a DOM layer for UI controls and text that didn't need frequent updates, and a WebSocket layer for real-time data pushing. This separation kept the frame rate stable at 60fps even with heavy data loads.

---

**Q12: 你怎么把集成时间从3天缩短到2小时的？**
**Q12: How did you reduce integration time from 3 days to 2 hours?**

我做了通用查询组件封装Elasticsearch API。开发只需要传配置对象——索引名、筛选条件、聚合规则——不用写原始查询。我还给常见模式提供了复制粘贴的示例。这2小时包括读文档和测试，不只是写代码。
I created generic query components that wrapped Elasticsearch API. Developers just passed config objects — index name, filters, aggregations — instead of writing raw queries. I also provided copy-paste examples for common patterns. The 2 hours included reading docs and testing, not just coding.

---

**Q13: qiankun里Proxy沙箱和快照沙箱有什么区别？**
**Q13: What's the difference between Proxy sandbox and snapshot sandbox in qiankun?**

快照沙箱在切换应用时保存和恢复window对象状态。它更简单但较慢，多个应用同时运行时效果不好。Proxy沙箱用ES6 Proxy给每个应用伪造一个window对象。它更快且支持多应用，但需要现代浏览器。qiankun 2默认用Proxy。
Snapshot sandbox saves and restores window object states when switching apps. It's simpler but slower and doesn't work well with multiple apps running at the same time. Proxy sandbox uses ES6 Proxy to fake a window object per app. It's faster and supports multiple apps, but requires modern browsers. Qiankun 2 uses Proxy by default.

---

**Q14: 什么时候你会选Module Federation而不是qiankun？**
**Q14: When would you choose Module Federation over qiankun?**

Module Federation更适合应用需要深度集成时——实时共享代码，不只是iframe。qiankun更适合用不同技术栈的独立团队。如果所有团队都用Webpack 5且需要共享状态，我选Federation。如果团队混用React、Vue甚至jQuery，我选qiankun。
Module Federation is better when apps need deep integration — sharing code in real time, not just iframes. Qiankun is better for independent teams with different tech stacks. I'd choose Federation if all teams use Webpack 5 and need shared state. I'd choose qiankun if teams use React, Vue, or even jQuery mixed together.

---

**Q15: Tree Shaking失效时你怎么处理？**
**Q15: How do you handle Tree Shaking failure?**

首先检查包是否用ES模块——CommonJS不能被Tree Shaking。其次检查package.json的"sideEffects"字段——缺少它会让Webpack保留所有代码。第三检查Babel是否把ES模块转成了CommonJS。我修过一个案例，lodash的引入方式是import _ from 'lodash'而不是import debounce from 'lodash/debounce'。
First, check if the package uses ES modules — CommonJS can't be tree-shaken. Second, check package.json "sideEffects" field — missing it makes Webpack keep everything. Third, check if Babel transpiles ES modules to CommonJS. I fixed one case where a lodash import was import _ from 'lodash' instead of import debounce from 'lodash/debounce'.

---

## 通用面试问题（中文在上，英文在下）

---

**Q: 你上家公司为什么离职？**
**Q: Why did you leave your previous company?**

我因公司部门优化和裁员离开了上家公司。这是组织层面的决定，与我的工作表现无关。现在我正在寻找能更充分发挥我前后端开发技能的新职位。
I left my previous company due to departmental optimization and layoffs. It was an organizational decision, not related to my performance. I'm now looking for a new role where I can apply my front-end development skills more fully.

---

**Q: 你最大的缺点是什么？**
**Q: What is your greatest weakness?**

我有点完美主义，以前会在小细节上花太多时间。
现在我会提前设定截止日期，并尽早寻求反馈。
这让我能更快完成工作，同时不牺牲质量。
I'm a bit of a perfectionist, so I used to spend too much time on small details.
Now I set earlier deadlines and ask for feedback sooner.
This helps me work faster without losing quality.

---

**Q: 你最大的优势是什么？或者你最擅长什么？**
**Q: What is your greatest strength? or What are you best at?**

我最大的优势是学得快、能落地。
在京东金融和宜人贷，我能快速理解业务需求并做出可用的方案。
比如，我[具体成果，比如把贷款审批速度提升了20%]。
我能把这种执行力带到渣打银行。
My biggest strength is that I learn fast and get things done.
At JD Finance and Yirendai, I quickly understood new business needs and built solutions that worked.
For example, I [specific result, like improved loan approval speed by 20%].
I can bring this same focus to Standard Chartered.

---

**Q: 说说你失败的一次经历。**
**Q: Tell me about a time you failed.**

职业生涯早期，我负责一个项目，但没留够时间，也没及时把问题说出来。
我们晚了两周才交付。
我主动承认是我的责任。
从那以后，我每周都会检查风险。
到现在我已经按时完成了15个以上项目。
我学到的是：早点暴露问题，比计划完美更重要。
Early in my career, I led a project but didn't plan enough time and didn't tell people about problems early.
We finished two weeks late.
I said it was my fault.
After that, I started checking risks every week.
Now I've finished more than 15 projects on time.
I learned that telling people about problems early is more important than perfect plans.

---

**Q: 我们为什么要选你而不是其他合格的候选人？**
**Q: Why should we hire you over other qualified candidates?**

我不了解其他候选人，但我可以讲讲我自己。
我既有扎实的技术能力，也有带领不同团队的经验。
在宜人贷，我帮工程师和销售团队更好地协作。
我们的销售效率提升了300%。
我相信在这里也能做到类似的事情。
I don't know the other candidates, but I can tell you about me.
I have both strong technical skills and experience leading different teams.
At Yirendai, I helped engineers and salespeople work together better.
Our sales speed went up 300%.
I'm sure I can do something similar here.

---

**Q: 你五年后想达到什么位置？**
**Q: Where do you see yourself in 5 years?**

我想在专业上更精进，承担更多工作——比如带领更大的团队或发起新项目。
这个岗位很适合我，因为它能帮助我成长。
我想成为真正能推动业务增长的人。
I want to get better at my job and take on more work—like leading bigger teams or starting new projects.
This role is great for me because it can help me grow.
I want to become someone who can really help the business grow.

---

**Q: 你为什么离开上一家公司？（或：你为什么想离职？）**
**Q: Why did you leave your last job? (or Why are you leaving?)**

我在京东金融和宜人贷工作过。
我学到了很多关于线上贷款的知识。
现在我想在一家大型国际银行工作。
渣打银行正在大力发展数字业务。
我能用我的金融科技经验来贡献力量。
I worked at JD Finance and Yirendai.
I learned a lot about online loans.
Now I want to work at a big global bank.
Standard Chartered is growing its digital business.
I can use my fintech experience to help.

---

**Q: 描述一次你和同事发生冲突的经历。**
**Q: Describe a time you had a conflict with a coworker.**

有一次我和同事对先做哪个功能有分歧。
我没有争论，而是建议用真实用户来测试两个方案。
他的方案效果更好，我就支持了他。
这让我明白：用数据而不是主观意见来做决定，能带来更好的结果和更好的团队协作。
A coworker and I didn't agree on which feature to build first.
Instead of arguing, I suggested we test both ideas with real users.
His idea worked better, so I supported it.
This taught me that using data to make decisions, not just opinions, leads to better results and better teamwork.

---

**Q: 你前老板会怎么评价你？**
**Q: What would your previous boss say about you?**

他们会说，工作越难的时候，我越靠得住。
They'd say I'm reliable when work gets tough.

---

**Q: 你如何应对压力和紧张？**
**Q: How do you handle stress and pressure?**

忙的时候，我先聚焦在最重要的事情上。
我会找到那小部分能带来大成果的工作。
我也会给自己留时间，比如晨跑，保持身体健康。
上个季度，这让我即使在长时间工作的情况下，也顺利完成了[那个项目]。
When I'm busy, I focus on the most important work first.
I find the small part of work that brings big results.
I also make time for myself, like a morning run, to stay healthy.
Last quarter, this helped me finish [the project] even when I worked long hours.

---

**Q: 你有什么问题想问我们吗？**
**Q: Do you have any questions for us?**

团队目前面临的最大挑战是什么？
What's the biggest challenge the team is currently facing?

这个职位之前的任职者是如何发展的？
How has this position evolved from previous holders?

---

**Q: 你的薪资期望是多少？**
**Q: What are your salary expectations?**

对于合适的工作，我是灵活的。
我也想了解更多关于整体薪酬包和晋升机会的信息。
I'm flexible for the right job.
I'd also like to know more about the full pay package and growth opportunities.

---

## AI 相关问题（中文在上，英文在下）

---

**Q1: 你怎么用AI加速日常编码工作？**
**Q1: How do you use AI to speed up your daily coding work?**

我用GitHub Copilot写样板代码、重复逻辑和单元测试，省了约30%的打字时间。复杂算法我先问ChatGPT讲思路，然后自己实现。我从不盲目复制AI代码——总会审查、测试、重构，以符合团队编码规范。
I use GitHub Copilot for boilerplate code, repetitive logic, and unit tests. It saves me about 30% of typing time. For complex algorithms, I ask ChatGPT to explain the approach first, then I implement it myself. I never copy AI code blindly — I always review, test, and refactor to match our team's coding standards.

---

**Q2: 遇到解决不了的bug时，AI怎么帮你？**
**Q2: When you hit a bug you can't solve, how does AI help?**

我把错误信息和相关代码贴给AI，但会加上上下文——我试过什么、期望什么、实际发生了什么。这样比只丢错误信息得到更好答案。AI经常提示我忽略的角度，比如竞态条件或微妙的TypeScript类型问题。但每个建议我都会验证后再用。
I paste the error message and relevant code into AI, but I add context — what I tried, what I expected, what actually happened. This gets better answers than just dumping the error. AI often suggests angles I missed, like a race condition or a subtle TypeScript type issue. But I verify every suggestion before applying it.

---

**Q3: AI能取代代码审查，还是只能辅助？**
**Q3: Can AI replace code review, or just assist it?**

AI辅助，不能取代。我用AI先抓明显问题——未使用变量、缺失错误处理、潜在空引用。这让人工审查者能专注架构、业务逻辑和边界情况。我的工作流：AI预审→自动修简单问题→人工审查设计决策。
AI assists, not replaces. I use AI to catch obvious issues first — unused variables, missing error handling, potential null references. This frees human reviewers to focus on architecture, business logic, and edge cases. My workflow: AI pre-review → auto-fix simple issues → human review for design decisions.

---

**Q4: 你怎么用AI更快学习前端新技术？**
**Q4: How do you use AI to learn new frontend technologies faster?**

学新库时，我让AI用简单类比讲核心概念，然后给个最小可用示例。卡住时我也用AI翻译英文文档。但我总会和官方文档交叉验证——AI有时会幻觉API名称或过时语法。
When I need to learn a new library, I ask AI to explain the core concepts with simple analogies, then give me a minimal working example. I also use AI to translate English documentation when I'm stuck. But I always cross-check with official docs — AI sometimes hallucinates API names or outdated syntax.

---

**Q5: 你怎么给前端团队引入AI工具，同时避免依赖或质量问题？**
**Q5: How would you introduce AI tools to your frontend team without causing dependency or quality issues?**

第一，定明确规则：AI写草稿，人对最终代码负责。
第二，执行同样审查标准——AI生成的代码也要走PR审查。
第三，追踪指标：我们交付更快了，还是bug更多了？
我先小范围试点——一个项目用Copilot两周——然后和团队分享结果和规范。
First, set clear rules: AI writes drafts, humans own the final code.
Second, enforce the same review standards — AI-generated code goes through the same PR review.
Third, track metrics: are we shipping faster, or just creating more bugs?
I started with a small pilot — one project using Copilot for two weeks — then shared results and guidelines with the team.

---

以上内容已全部调整为**中文在上，英文在下**的格式。如需导出为文件或进一步调整，告诉我！