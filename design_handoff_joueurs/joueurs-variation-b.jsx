/* global React, Logo, CHAR, sgn */
/* =====================================================================
   VARIATION B — CARNET D'AVENTURIER
   Editorial / journal style. Portrait-led hero, calmer chrome,
   serif lead-ins, two-column with a strong horizontal rhythm.
===================================================================== */
const VariationB = () => {
  const C = CHAR;
  const hpPct = (C.hp / C.hpMax) * 100;
  return (
    <div className="vB j-art" style={{ width: 1280, minHeight: 980, background: "#0e0a04", color: "var(--k-text)", position: "relative" }}>
      {/* HEADER — minimal */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid var(--k-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo s={22} />
          <span style={{ fontFamily: "var(--k-ft)", color: "var(--k-gold)", fontSize: 16, letterSpacing: ".05em" }}>Kaleysur</span>
          <span style={{ color: "var(--k-mute)", fontSize: 11, marginLeft: 8 }}>·</span>
          <span className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)" }}>Carnet d'aventurier</span>
        </div>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid transparent" }}>
          {["Personnage", "Inventaire", "Sorts", "Notes", "Aide"].map((t, i) => (
            <button key={t} className="k-mono-cap" style={{
              background: "transparent",
              border: "none",
              borderBottom: "2px solid " + (i === 0 ? "var(--k-gold)" : "transparent"),
              color: i === 0 ? "var(--k-gold)" : "var(--k-text2)",
              padding: "8px 16px", fontSize: 10, cursor: "pointer", marginBottom: -21
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* PARTY RIBBON */}
      <div style={{ display: "flex", gap: 0, padding: "10px 40px", background: "#0a0703", borderBottom: "1px solid var(--k-border)" }}>
        {C.party.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 18px",
            borderRight: i < C.party.length - 1 ? "1px solid rgba(74,53,16,0.5)" : "none",
            background: p.active ? "linear-gradient(180deg, transparent, rgba(201,162,39,0.06))" : "transparent",
            borderBottom: p.active ? "2px solid var(--k-gold)" : "2px solid transparent",
            marginBottom: -11
          }}>
            <span style={{ fontSize: 16, color: p.color }}>{p.ico}</span>
            <div>
              <div style={{ fontFamily: "var(--k-ft)", fontSize: 12, color: p.active ? "var(--k-gold)" : "var(--k-text2)" }}>{p.n}</div>
              <div style={{ fontSize: 9, color: "var(--k-mute)" }}>{p.cls} · {p.hp}/{p.hpMax} pv</div>
            </div>
          </div>
        ))}
        <button style={{ marginLeft: "auto", background: "transparent", border: "1px dashed var(--k-border)", color: "var(--k-goldD)", padding: "4px 12px", borderRadius: 99, fontSize: 10, cursor: "pointer", fontFamily: "var(--k-ft)" }}>+ Nouveau personnage</button>
      </div>

      {/* HERO — large character "page" */}
      <div style={{ padding: "32px 40px 20px", display: "grid", gridTemplateColumns: "260px 1fr 320px", gap: 28, alignItems: "stretch" }}>

        {/* Portrait column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ aspectRatio: "3/4", background: "linear-gradient(135deg, #1f1709 0%, #0d0905 100%)", border: "1px solid var(--k-borderL)", borderRadius: 4, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Placeholder portrait — sigil */}
            <svg viewBox="0 0 100 100" width="60%" height="60%" style={{ opacity: 0.3 }}>
              <circle cx="50" cy="36" r="18" fill="none" stroke="#c9a227" strokeWidth="0.8" />
              <path d="M 18 88 Q 50 56 82 88" fill="none" stroke="#c9a227" strokeWidth="0.8" />
              <text x="50" y="98" textAnchor="middle" fontFamily="Cinzel" fontSize="6" fill="#8a6e1a" letterSpacing="2">PORTRAIT</text>
            </svg>
            <span className="k-corner tl">✦</span><span className="k-corner tr">✦</span>
            <span className="k-corner bl">✦</span><span className="k-corner br">✦</span>
          </div>
          {/* Mini stats below portrait */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--k-border)", border: "1px solid var(--k-border)", borderRadius: 4, overflow: "hidden" }}>
            {[["CA", C.ac], ["INIT", sgn(C.init)], ["VIT", C.speed]].map(([l, v]) => (
              <div key={l} style={{ background: "#0e0a04", padding: "12px 6px", textAlign: "center" }}>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontFamily: "var(--k-ft)", color: "var(--k-gold)", fontSize: 20, lineHeight: 1 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead — title + bio */}
        <div>
          <div className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", marginBottom: 6 }}>Folio · An 287</div>
          <div style={{ fontFamily: "var(--k-ft)", fontSize: 48, color: "var(--k-gold)", lineHeight: 1.05, letterSpacing: ".02em", marginBottom: 8, textShadow: "0 0 30px rgba(201,162,39,0.2)" }}>{C.name}</div>
          <div style={{ fontFamily: "var(--k-fb)", fontStyle: "italic", color: "var(--k-parchD)", fontSize: 16, marginBottom: 18 }}>{C.classLine}</div>

          {/* facts row, newspaper-style */}
          <div style={{ display: "flex", gap: 0, paddingTop: 16, paddingBottom: 16, borderTop: "1px solid var(--k-border)", borderBottom: "1px solid var(--k-border)", marginBottom: 18 }}>
            {[["Espèce", C.species], ["Background", C.background], ["Alignement", C.alignment], ["Niveau", C.level], ["XP", C.xp.toLocaleString()], ["Maîtrise", `+${C.prof}`]].map(([k, v], i) => (
              <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 16, borderLeft: i === 0 ? "none" : "1px solid var(--k-border)" }}>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginBottom: 4 }}>{k}</div>
                <div style={{ color: "var(--k-parchment)", fontSize: 13, fontFamily: "var(--k-ft)" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Abilities — flat row, generous */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {C.abilities.map((a, i) => (
              <div key={i} style={{ background: "transparent", border: "1px solid var(--k-border)", borderRadius: 3, textAlign: "center", padding: "12px 4px 10px", transition: "all .2s" }}>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-goldD)", marginBottom: 4 }}>{a.k}</div>
                <div style={{ fontFamily: "var(--k-ft)", color: "var(--k-gold)", fontSize: 26, lineHeight: 1, fontWeight: 600 }}>{sgn(a.m)}</div>
                <div style={{ fontSize: 9, color: "var(--k-mute)", marginTop: 4, paddingTop: 4, borderTop: "1px dashed rgba(74,53,16,0.5)" }}>{a.sc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail — Vitals "page edge" */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "linear-gradient(180deg, #1a1308, #0e0a04)", border: "1px solid var(--k-borderL)", borderRadius: 4, padding: "18px 18px 16px" }}>
            <div className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", marginBottom: 10 }}>Vitalité</div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--k-ft)", fontSize: 44, color: "var(--k-goldL)", lineHeight: 1, textShadow: "0 0 20px rgba(201,162,39,0.4)" }}>{C.hp}</span>
              <span style={{ color: "var(--k-mute)", fontSize: 14 }}>/ {C.hpMax}</span>
              <span className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginLeft: "auto" }}>PV</span>
            </div>
            {/* Linear bar */}
            <div style={{ height: 8, background: "#0a0703", border: "1px solid var(--k-border)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${hpPct}%`, height: "100%", background: hpPct > 50 ? "var(--k-success)" : hpPct > 25 ? "var(--k-radiant)" : "var(--k-danger)" }} />
              {C.hpTemp > 0 && <div style={{ position: "absolute", right: 0, top: 0, width: `${(C.hpTemp / C.hpMax) * 100}%`, height: "100%", background: "#3d7abf" }} />}
            </div>
            {C.hpTemp > 0 && <div style={{ fontSize: 10, color: "#5a9fd4", marginTop: 6, fontStyle: "italic" }}>+{C.hpTemp} pv temporaires</div>}

            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button style={{ flex: 1, background: "rgba(201,122,122,0.1)", border: "1px solid rgba(201,122,122,0.3)", color: "var(--k-danger)", padding: "6px", fontSize: 10, borderRadius: 3, fontFamily: "var(--k-ft)", cursor: "pointer" }}>⚔ Blesser</button>
              <input style={{ width: 50, background: "#0a0703", border: "1px solid var(--k-border)", color: "var(--k-text)", textAlign: "center", borderRadius: 3, fontSize: 11 }} placeholder="0" />
              <button style={{ flex: 1, background: "rgba(106,186,106,0.1)", border: "1px solid rgba(106,186,106,0.3)", color: "var(--k-success)", padding: "6px", fontSize: 10, borderRadius: 3, fontFamily: "var(--k-ft)", cursor: "pointer" }}>✚ Soigner</button>
            </div>

            {/* HD + Death */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--k-border)" }}>
              <div>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginBottom: 4 }}>Dés de Vie</div>
                <div style={{ color: "var(--k-gold)", fontFamily: "var(--k-ft)", fontSize: 14 }}>{C.hdLeft}<span style={{ color: "var(--k-mute)", fontSize: 11 }}>/{C.hdMax} {C.hd}</span></div>
              </div>
              <div>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginBottom: 4 }}>Death Saves</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3].map(i => <span key={`s${i}`} style={{ width: 9, height: 9, borderRadius: "50%", border: "2px solid #3a3a4a" }} />)}
                  <span style={{ width: 6 }} />
                  {[1, 2, 3].map(i => <span key={`f${i}`} style={{ width: 9, height: 9, borderRadius: "50%", border: "2px solid #3a3a4a" }} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Conditions chips */}
          <div style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 4, padding: "12px 14px" }}>
            <div className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", marginBottom: 8 }}>Statuts actifs</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              <Chip color="conc" label="Concentration" />
              <Chip color="neg" label="Lié" />
              <Chip color="off" label="+ ajouter" />
            </div>
          </div>

          {/* Resources */}
          <div style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 4, padding: "12px 14px" }}>
            <div className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", marginBottom: 8 }}>Ressources</div>
            {C.resources.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "6px 0", borderTop: i ? "1px dashed rgba(74,53,16,0.4)" : "none" }}>
                <div style={{ flex: 1, fontSize: 11, color: "var(--k-text2)" }}>{r.n}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: r.max }).map((_, j) => (
                    <span key={j} style={{ width: 11, height: 11, borderRadius: 2, border: "1.5px solid var(--k-goldD)", background: j < r.cur ? "var(--k-goldD)" : "transparent" }} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--k-border)" }}>
              <button style={{ flex: 1, background: "transparent", border: "1px solid #3a6060", color: "#7ababa", padding: "5px", fontSize: 9, borderRadius: 3, fontFamily: "var(--k-ft)", letterSpacing: ".05em", cursor: "pointer" }}>☽ COURT</button>
              <button style={{ flex: 1, background: "transparent", border: "1px solid #3a4a6a", color: "#8ab0e0", padding: "5px", fontSize: 9, borderRadius: 3, fontFamily: "var(--k-ft)", letterSpacing: ".05em", cursor: "pointer" }}>★ LONG</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONED COLUMNS — saves/skills | combat (attacks) | spells & features */}
      <div style={{ padding: "0 40px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>

        <Column title="Sauvegardes & Compétences">
          <SubH>Sauvegardes</SubH>
          {C.saves.map((s, i) => (
            <BLine key={i} on={s.p}>
              <span style={{ flex: 1 }}>{s.n}</span>
              <span style={{ fontFamily: "var(--k-ft)", color: "var(--k-gold)" }}>{sgn(s.v)}</span>
            </BLine>
          ))}
          <SubH>Compétences</SubH>
          {C.skills.map((s, i) => (
            <BLine key={i} on={s.p}>
              <span style={{ flex: 1 }}>{s.n}</span>
              <span className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginRight: 8 }}>{s.a}</span>
              <span style={{ fontFamily: "var(--k-ft)", color: "var(--k-gold)" }}>{sgn(s.v)}</span>
            </BLine>
          ))}
        </Column>

        <Column title="Attaques" cta="+ Ajouter">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                {["Nom", "Bonus", "Dégâts", "Type"].map(h => (
                  <th key={h} className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-goldD)", textAlign: "left", padding: "0 4px 8px", borderBottom: "1px solid var(--k-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {C.attacks.map((a, i) => (
                <tr key={i} style={{ borderBottom: "1px dashed rgba(74,53,16,0.4)" }}>
                  <td style={{ padding: "9px 4px", color: "var(--k-parchment)" }}>{a.n}</td>
                  <td style={{ padding: "9px 4px", color: "var(--k-gold)", fontFamily: "var(--k-ft)" }}>{a.bonus}</td>
                  <td style={{ padding: "9px 4px" }}>{a.dmg}</td>
                  <td style={{ padding: "9px 4px", color: "var(--k-text2)", fontStyle: "italic", fontSize: 10 }}>{a.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <SubH style={{ marginTop: 16 }}>Traits & Capacités</SubH>
          {C.features.map((f, i) => (
            <div key={i} style={{ padding: "7px 0", borderBottom: i < C.features.length - 1 ? "1px dashed rgba(74,53,16,0.4)" : "none" }}>
              <div style={{ fontSize: 11, color: "var(--k-parchment)" }}>{f.n}</div>
              <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginTop: 2 }}>{f.src}</div>
            </div>
          ))}
        </Column>

        <Column title="Magie">
          <SubH>Emplacements</SubH>
          {C.spellSlots.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <span className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", width: 38 }}>Niv. {s.lvl}</span>
              <div style={{ display: "flex", gap: 5, flex: 1 }}>
                {Array.from({ length: s.max }).map((_, j) => (
                  <span key={j} style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--k-goldD)", background: j < s.used ? "var(--k-goldD)" : "transparent" }} />
                ))}
              </div>
            </div>
          ))}

          <SubH style={{ marginTop: 14 }}>Sorts préparés</SubH>
          {(() => {
            const grouped = {};
            C.spells.forEach(s => { (grouped[s.lvl] = grouped[s.lvl] || []).push(s.n); });
            return Object.entries(grouped).map(([lvl, names]) => (
              <div key={lvl} style={{ marginBottom: 8 }}>
                <div className="k-mono-cap" style={{ fontSize: 8, color: "var(--k-mute)", marginBottom: 4 }}>{lvl === "T" ? "Tours" : `Niveau ${lvl}`}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {names.map(n => (
                    <span key={n} style={{ fontFamily: "var(--k-ft)", fontSize: 10, padding: "3px 9px", border: "1px solid var(--k-border)", borderRadius: 3, color: "var(--k-parchment)", background: "rgba(201,162,39,0.04)" }}>{n}</span>
                  ))}
                </div>
              </div>
            ));
          })()}
        </Column>

      </div>

      {/* footer ornament */}
      <div style={{ textAlign: "center", color: "var(--k-goldD)", opacity: 0.4, letterSpacing: ".5rem", padding: "14px 0 24px", fontSize: 12 }}>✦ ✦ ✦</div>
    </div>
  );
};

const Column = ({ title, cta, children }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, marginBottom: 12, borderBottom: "1px solid var(--k-borderL)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 18, height: 1, background: "var(--k-goldD)" }} />
        <span style={{ fontFamily: "var(--k-ft)", fontSize: 13, color: "var(--k-gold)", letterSpacing: ".06em" }}>{title}</span>
      </div>
      {cta && <button className="k-mono-cap" style={{ fontSize: 8, background: "transparent", border: "1px solid var(--k-border)", color: "var(--k-gold)", padding: "3px 7px", borderRadius: 3, cursor: "pointer" }}>{cta}</button>}
    </div>
    {children}
  </div>
);
const SubH = ({ children, style }) => (
  <div className="k-mono-cap" style={{ fontSize: 9, color: "var(--k-goldD)", padding: "10px 0 6px", borderBottom: "1px dashed rgba(74,53,16,0.4)", marginBottom: 6, ...style }}>{children}</div>
);
const BLine = ({ on, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 2px", fontSize: 11, color: on ? "var(--k-parchment)" : "var(--k-text2)" }}>
    <span style={{ width: 9, height: 9, borderRadius: "50%", border: "2px solid var(--k-border)", background: on ? "var(--k-gold)" : "transparent", flexShrink: 0 }} />
    {children}
  </div>
);
const Chip = ({ color, label }) => {
  const styles = {
    conc: { border: "#6040c0", bg: "#1a0f2a", c: "#c0a0f0" },
    neg: { border: "#c04040", bg: "#2a0f0f", c: "#f08080" },
    off: { border: "var(--k-border)", bg: "transparent", c: "var(--k-mute)" }
  };
  const s = styles[color];
  return <span style={{ fontFamily: "var(--k-ft)", fontSize: 10, padding: "3px 9px", borderRadius: 99, border: "1px solid " + s.border, background: s.bg, color: s.c }}>{label}</span>;
};

window.VariationB = VariationB;
