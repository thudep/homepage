// 通用：在任何赛事页里直接引入即可
document.addEventListener("DOMContentLoaded", () => {
    const pageName = window.location.pathname.split("/").pop().replace(/\.html$/i, "");

    // 可能的 JSON 相对路径（从近到远，命中即用）
    const candidates = [
        `${pageName}.json`,
        `./${pageName}.json`,
        `event/${pageName}.json`,
        `../event/${pageName}.json`,
        `../../event/${pageName}.json`,
        `json/${pageName}.json`,
        `../json/${pageName}.json`,
        `../../json/${pageName}.json`,
    ];

    (async function init() {
        let events = null;
        let usedPath = null;

        for (const p of candidates) {
            try {
                const res = await fetch(p, { cache: "no-store" });
                if (res.ok) {
                    events = await res.json();
                    usedPath = p;
                    break;
                }
            } catch (_) {}
        }
        if (!Array.isArray(events) || events.length === 0) {
            console.error("未找到有效的赛事 JSON：", candidates);
            return;
        }

        // 以 session 排序，默认显示最新（最大）
        events.sort((a, b) => (a.session || 0) - (b.session || 0));
        let currentIndex = events.length - 1;

        const main = document.querySelector("main");
        if (!main) return;

        // 容器：只在 main 末尾追加一次
        const section = document.createElement("div");
        section.className = "committee-section";
        main.appendChild(section);

        render();

        // ---------- 渲染 ----------
        function render() {
            section.innerHTML = "";

            const data = events[currentIndex];

            // h2 + 导航
            const h2 = document.createElement("h2");
            h2.textContent = `第${data.session}届组委会`;

            // h2 右侧导航容器（仅当可切换时显示对应按钮）
            const nav = document.createElement("span");
            nav.className = "session-nav";

            if (currentIndex < events.length - 1) {
                // 下一“更近/更新的一届”（向下箭头）
                nav.appendChild(
                    makeBtn("fas fa-arrow-down", () => {
                        currentIndex++;
                        render();
                    }, "下一届")
                );
            }
            if (currentIndex > 0) {
                // 上一“更早的一届”（向上箭头）
                nav.appendChild(
                    makeBtn("fas fa-arrow-up", () => {
                        currentIndex--;
                        render();
                    }, "上一届")
                );
            }

            h2.appendChild(nav);
            section.appendChild(h2);

            // 有指导教师才显示两段 h3
            const hasSup = Array.isArray(data.supervisor) && data.supervisor.length > 0;
            if (hasSup) {
                const h3Sup = document.createElement("h3");
                h3Sup.textContent = "指导教师";
                section.appendChild(h3Sup);

                const supDiv = document.createElement("div");
                supDiv.className = "member-list supervisors";
                data.supervisor.forEach((s) => {
                    supDiv.appendChild(makePersonSpan({ name: s.name }));
                });
                section.appendChild(supDiv);

                const h3Stu = document.createElement("h3");
                h3Stu.textContent = "学生成员";
                section.appendChild(h3Stu);
            }

            // 学生成员（leader 置前 + committee）
            const stuDiv = document.createElement("div");
            stuDiv.className = "member-list students";

            if (Array.isArray(data.leader) && data.leader.length > 0) {
                data.leader.forEach((l) => {
                    stuDiv.appendChild(makePersonSpan(l, true)); // true: leader
                });
            }

            if (Array.isArray(data.committee) && data.committee.length > 0) {
                data.committee.forEach((c) => {
                    stuDiv.appendChild(makePersonSpan(c));
                });
            }

            section.appendChild(stuDiv);
        }

        // ---------- 小工具 ----------
        function makeBtn(iconClass, onClick, title) {
            const btn = document.createElement("button");
            btn.className = "session-change-btn";
            btn.type = "button";
            btn.title = title || "";
            const i = document.createElement("i");
            i.className = iconClass; // 需要页面已引入 Font Awesome
            btn.appendChild(i);
            btn.addEventListener("click", onClick);
            return btn;
        }

        function makePersonSpan(mem, isLeader = false) {
            const span = document.createElement("span");
            span.className = "member-item" + (isLeader ? " leader" : "");
            const name = mem && mem.name ? String(mem.name) : "";

            if (mem && mem.website) {
                const a = document.createElement("a");
                a.href = `../../members/member/${mem.website}.html`;
                a.textContent = name;
                a.rel = "noopener";
                span.appendChild(a);
            } else {
                span.textContent = name;
            }
            return span;
        }
    })();
});
