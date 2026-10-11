const $ = (id) => document.getElementById(id);
async function post(url) {
  const response = await fetch(url, {method: "POST"});
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}
async function refresh() {
  try {
    const [statusRes, eventsRes] = await Promise.all([fetch("/api/status"), fetch("/api/events")]);
    const status = await statusRes.json();
    const events = await eventsRes.json();
    $("monitorStatus").textContent = status.monitoring ? "Active" : "Stopped";
    $("eventCount").textContent = status.event_count;
    $("folderPath").textContent = status.folder;
    $("liveBadge").innerHTML = `<i></i>${status.monitoring ? "Monitoring live" : "Monitor stopped"}`;
    $("liveBadge").className = "badge " + (status.monitoring ? "online" : "");
    $("alertBanner").classList.toggle("hidden", !status.warning);
    $("eventRows").innerHTML = events.length ? events.map(e => {
      const level = e.level.toLowerCase();
      return `<tr><td>${escapeHtml(e.time)}</td><td>${escapeHtml(e.type)}</td><td>${escapeHtml(e.details)}</td><td><span class="level ${level}">${escapeHtml(e.level)}</span></td></tr>`;
    }).join("") : '<tr><td colspan="4" class="empty">No events yet. Create or modify a file inside test_files/ to generate activity.</td></tr>';
  } catch (e) {
    $("liveBadge").textContent = "Connection issue";
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
$("startBtn").addEventListener("click", async () => { try { await post("/api/monitor/start"); await refresh(); } catch(e) { alert("Could not start monitoring."); }});
$("stopBtn").addEventListener("click", async () => { try { await post("/api/monitor/stop"); await refresh(); } catch(e) { alert("Could not stop monitoring."); }});
$("clearBtn").addEventListener("click", async () => { try { await post("/api/monitor/reset"); await refresh(); } catch(e) { alert("Could not clear events."); }});
refresh();
setInterval(refresh, 2000);
