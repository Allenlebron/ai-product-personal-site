export const stories = {
  "55521581418185184": {
    category: "FDE / 需求拆解",
    published: "2026-10-27T22:49:00+08:00",
    displayTime: "2026.10.27 22:49",
    title: "客户想要整个平台，先找到值得做的一步",
    lead: "这条需求复盘提醒：AI 项目要从能验证的一步开始，而不是先承诺一整套系统。",
    fact: "作者自述，在与一位医疗客户讨论后，项目范围从多学科整合平台收窄到住院期的一个教学环节；后来还复盘了对接人并非拍板人的问题。",
    analysis: [
      "平台愿景可以很大，第一步却应该足够具体。只有说清谁操作、输入从哪里来、产出交给谁，以及怎样判断有效，团队才能估算交付成本和验收方式。",
      "这篇案例的价值不在于某一套打分公式，而在于先追问现有业务怎样运行，再决定第一步做什么。需求会谈的成果不该只是功能清单，还应包括暂时不做的范围和需要谁来确认。"
    ],
    steps: [
      "会前用公开资料列出业务假设，现场逐项求证，不把假设当成客户事实。",
      "只选一个高频环节，写清操作者、输入、输出和人工复核点，再谈功能。",
      "确认对接人能否决定预算与验收；未确认时，先做问题澄清，不急着承诺方案。"
    ],
    boundary: "会议次数、方案与开发提效数字均来自作者自述，不能直接推算到其他项目。医疗场景还涉及隐私、专业责任和机构流程，具体方案须由相关人员评估。",
    source: "https://aipoju.com/topic-details/55521581418185184"
  },
  "22258218481521581": {
    category: "业务工具 / 交付信任",
    published: "2026-10-27T22:38:44+08:00",
    displayTime: "2026.10.27 22:38",
    title: "让 AI 进入业务流程，先让结果可追溯",
    lead: "工具跑得快，不等于同事敢用。对核对类工作，可信的结果往往比漂亮的演示更重要。",
    fact: "作者自述做过证书、税金和单证核对工具，但同事担心无法判断结论从何而来；随后作者调整了结果依据的呈现和使用流程。",
    analysis: [
      "文件核对的使用者承担着出错后的实际后果。如果系统只给一个通过或不通过的结论，使用者仍要重新翻原始文件，所谓效率就难以落到日常工作里。",
      "更可用的交付方式，是把每一项差异连回原始文件和字段，标明哪些由规则核对、哪些仍需人工确认。AI 藏在流程后面可以降低学习门槛，但不能把核对依据也藏起来。"
    ],
    steps: [
      "选一个重复频繁、输入相对稳定的核对环节，先记录人工核对的步骤。",
      "让结果同时显示结论、证据位置、异常原因和待人工处理项。",
      "邀请实际使用者试用，观察他们是否还要回头重做一遍，而不只统计运行速度。"
    ],
    boundary: "作者另附的完整复盘未在本站读取。跨境单证、税金与合规结论有专业风险，工具应辅助核对，不应代替有责任的人工审批。",
    source: "https://aipoju.com/topic-details/22258218481521581"
  },
  "22258218242521881": {
    category: "AI 工作流 / 知识迁移",
    published: "2026-10-27T12:49:29+08:00",
    displayTime: "2026.10.27 12:49",
    title: "换模型之前，先把业务规则从对话里搬出来",
    lead: "长期使用 AI 积累的价值，不应只留在某个聊天窗口里。",
    fact: "作者记录了一位学员担心换 AI 工具后，月报口径、业务背景与汇报偏好需要重新解释的问题，并建议先整理对话中稳定的资料与规则。",
    analysis: [
      "一个越来越懂业务的对话窗口，看起来像资产，但它也依赖具体工具和上下文。真正可迁移的，是已经被人确认过的指标定义、分析步骤、输出格式与例外处理方式。",
      "整理时不要整段复制历史聊天。把稳定规则与一次性任务分开，标注来源和更新时间，再用一份已知结果的月报做迁移测试，才能知道新工具是否真的理解了这些规则。"
    ],
    steps: [
      "从最近反复纠正 AI 的地方入手，挑出三到五条稳定的业务规则。",
      "给每条规则补上来源、适用范围和负责人，避免旧口径被长期沿用。",
      "用同一份脱敏样例在新旧工具中试跑，对比关键数字与解释，而不只看文风。"
    ],
    boundary: "作者外链中的完整分享未在本站读取。企业财务资料可能包含敏感信息，迁移前应先确认数据权限、保密要求与工具的使用范围。",
    source: "https://aipoju.com/topic-details/22258218242521881"
  },
  "22258218222828541": {
    category: "AI 交付 / 验收",
    published: "2026-10-27T10:28:07+08:00",
    displayTime: "2026.10.27 10:28",
    title: "AI 项目“能跑”，还不等于可以验收",
    lead: "演示顺利只是起点。交付是否成立，还要看失败时怎么处理、成本怎么算、结果怎么验证。",
    fact: "作者围绕失败路径、成本、可验证性、工程形态等方面，提出六类 AI 项目交付验收问题，并附有启发式扫描脚本。",
    analysis: [
      "AI 生成代码降低了搭出演示的门槛，也让“能跑”和“可长期使用”更容易被混为一谈。验收时需要把结果变成证据：失败输入能否复现，超时后如何降级，成本是否可观测，关键输出是否有自动或人工校验。",
      "脚本能提醒团队检查一些常见缺口，却无法理解业务风险。真正的验收仍要由实际场景、测试数据、运行记录和责任人共同完成。"
    ],
    steps: [
      "先写出项目必须通过的真实任务和不能接受的失败结果。",
      "用异常输入、模型超时和重复请求等情况验证失败路径。",
      "保存测试结果、成本记录与选型理由，让交付方和使用方能复核。"
    ],
    boundary: "随文脚本是启发式检查，不是生产就绪证明，不能替代代码审查、压测和安全评估。作者提到的商业数字未经独立核实。",
    source: "https://aipoju.com/topic-details/22258218222828541"
  }
};

if (typeof document !== "undefined") {
  const id = new URLSearchParams(window.location.search).get("id");
  const story = Object.hasOwn(stories, id) ? stories[id] : null;
  if (!story) {
    document.getElementById("story-not-found").hidden = false;
  } else {
    document.getElementById("story-article").hidden = false;
    document.title = `${story.title} · 破局情报站 · ZW`;
    document.querySelector('meta[name="description"]').content = story.lead;
    for (const [field, value] of Object.entries({
      category: story.category, title: story.title, lead: story.lead,
      fact: story.fact, boundary: story.boundary
    })) document.getElementById(`story-${field}`).textContent = value;
    const time = document.getElementById("story-time");
    time.dateTime = story.published;
    time.textContent = story.displayTime;
    const analysis = document.getElementById("story-analysis");
    for (const copy of story.analysis) {
      const paragraph = document.createElement("p");
      paragraph.textContent = copy;
      analysis.append(paragraph);
    }
    const steps = document.getElementById("story-steps");
    for (const copy of story.steps) {
      const item = document.createElement("li");
      item.textContent = copy;
      steps.append(item);
    }
    document.getElementById("story-source").href = story.source;
  }
}
