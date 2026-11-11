"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

const data: any = {
  "Téléphones": {
    iPhone: ["iPhone XR - 150$", "iPhone 11 - 220$", "iPhone 12 - 290$", "iPhone 13 - 380$", "iPhone 13 Pro - 450$", "iPhone 14 - 520$", "iPhone 14 Pro - 620$", "iPhone 15 - 680$", "iPhone 15 Pro - 780$", "iPhone 16 - 820$", "iPhone 16 Pro - 950$", "iPhone 17 - 1050$", "iPhone 17 Pro Max - 1200$"],
    Samsung: ["Galaxy A35 - 210$", "Galaxy A55 - 280$", "Galaxy S21 - 240$", "Galaxy S22 - 310$", "Galaxy S23 - 420$", "Galaxy S24 - 550$"],
    Tecno: ["Spark 20 - 110$", "Spark 30 - 135$", "Pova 6 - 160$", "Camon 30 - 180$", "Camon 40 - 220$"],
    Infinix: ["Hot 40 - 130$", "Hot 50 - 150$", "Note 40 - 170$"],
    Redmi: ["Redmi 13C - 95$", "Redmi Note 13 - 160$"],
  },
  "Vêtements": {
    Pantalons: ["Baggy - 25$", "Slim - 22$", "Cargo - 28$", "Jean - 24$"],
    Jackets: ["Jacket Cargo - 35$", "Jacket Cuir - 55$", "Jacket Denim - 40$"],
    Tricots: ["Pull - 20$", "Hoodie N-13 - 30$"],
    "T-Shirts": ["T-Shirt Oversize - 15$", "T-Shirt Graphic - 18$"],
    Vareuses: ["Vareuse N-13 - 18$", "Maillot - 15$"],
  },
  "Souliers": {
    Jordan: ["Jordan 1 High - 85$", "Jordan 3 Retro - 90$", "Jordan 4 Retro - 75$", "Jordan 11 - 95$"],
    Cactus: ["Travis Scott SB - 150$", "Cactus Jack Low - 130$"],
    "Air Force": ["Air Force White - 55$", "Air Force Black - 55$"],
    "Air Max": ["Air Max 90 - 70$", "Air Max 95 - 80$", "Air Max 97 - 85$"],
    Puma: ["Puma RS-X - 58$", "Puma Suede - 50$"],
    Adidas: ["Adidas Campus - 60$", "Adidas Samba - 48$", "Adidas Gazelle - 52$"],
  },
  "Montres & Chapeaux": {
    Montres: ["Smart Watch Ultra - 45$", "Casio Vintage - 25$", "Montre Rolex Style - 80$", "Apple Watch Series 9 - 320$"],
    Chapeaux: ["Casquette N-13 - 10$", "Bob - 12$", "Bonnet - 8$", "Chapeau Cowboy - 20$"],
  },
};

type Item = { nom: string; prix: number; qte: number; cat: string; marque: string };
const getPrix = (p: string) => Number(p.split(" - ")[1]?.replace("$", "") || 0);

export default function Home() {
  const [cat, setCat] = useState("Téléphones");
  const [marque, setMarque] = useState("iPhone");
  const [recherche, setRecherche] = useState("");
  const [budget, setBudget] = useState("Tous");
  const [tri, setTri] = useState("Populaire");
  const [panier, setPanier] = useState<Item[]>([]);
  const [showPanier, setShowPanier] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [achatDirect, setAchatDirect] = useState<Item | null>(null);
  const [nom, setNom] = useState("");
  const [sexe, setSexe] = useState("Homme");
  const [tel, setTel] = useState("");
  const [adresse, setAdresse] = useState("");
  const [taille, setTaille] = useState("");
  const [message, setMessage] = useState("");

  const marques = Object.keys(data[cat]);
  const total = panier.reduce((s, i) => s + i.prix * i.qte, 0);
  const totalQte = panier.reduce((s, i) => s + i.qte, 0);

  const tousProduits: Item[] = [];
  Object.keys(data).forEach((c) => Object.keys(data[c]).forEach((m) => data[c][m].forEach((p: string) => tousProduits.push({ nom: p, prix: getPrix(p), qte: 1, cat: c, marque: m }))));
  const enRecherche = recherche.trim().length > 0;
  let affiches = enRecherche ? tousProduits : data[cat][marque].map((p: string) => ({ nom: p, prix: getPrix(p), qte: 1, cat, marque }));
  if (recherche) affiches = affiches.filter((i: Item) => (i.nom + " " + i.cat + " " + i.marque).toLowerCase().includes(recherche.toLowerCase()));
  if (budget === "Moins de 50$") affiches = affiches.filter((i: Item) => i.prix < 50);
  if (budget === "50$ - 200$") affiches = affiches.filter((i: Item) => i.prix >= 50 && i.prix <= 200);
  if (budget === "200$ - 500$") affiches = affiches.filter((i: Item) => i.prix > 200 && i.prix <= 500);
  if (budget === "Plus de 500$") affiches = affiches.filter((i: Item) => i.prix > 500);
  if (tri === "Moins cher") affiches = [...affiches].sort((a: Item, b: Item) => a.prix - b.prix);
  if (tri === "Plus cher") affiches = [...affiches].sort((a: Item, b: Item) => b.prix - a.prix);

  const ajouterPanier = (it: Item) => {
    setPanier((prev) => {
      const ex = prev.find((x) => x.nom === it.nom);
      if (ex) return prev.map((x) => (x.nom === it.nom ? { ...x, qte: x.qte + 1 } : x));
      return [...prev, { ...it, qte: 1 }];
    });
    alert(it.nom + " ajouté au panier 🛒");
  };
  const changerQte = (n: string, d: number) => setPanier((p) => p.map((x) => (x.nom === n ? { ...x, qte: Math.max(1, x.qte + d) } : x)));
  const retirer = (n: string) => setPanier((p) => p.filter((x) => x.nom !== n));
  const ouvrirAchatDirect = (it: Item) => { setAchatDirect(it); setShowForm(true); };
  const ouvrirCommandePanier = () => { setAchatDirect(null); setShowPanier(false); setShowForm(true); };
  const envoyerCommande = () => {
    if (!nom || !adresse || !tel) { alert("Remplis ton nom, ton téléphone et ton adresse stp 🙏"); return; }
    const lignes = achatDirect ? `- ${achatDirect.nom} x 1 = ${achatDirect.prix}$` : panier.map((i: Item) => `- ${i.nom} x ${i.qte} = ${i.prix * i.qte}$`).join("\n");
    const totalFinal = achatDirect ? achatDirect.prix : total;
    const texte = `Bonjour N-13 BIGSHOP, NOUVELLE COMMANDE 🔥\n\n${lignes}\nTOTAL : ${totalFinal}$\n\nNom : ${nom}\nSexe : ${sexe}\nTéléphone : ${tel}\nAdresse : ${adresse}\nTaille / Couleur : ${taille || "-"}\nNote : ${message || "-"}`;
    window.open("https://wa.me/243984506008?text=" + encodeURIComponent(texte), "_blank");
    setShowForm(false); setPanier([]); setAchatDirect(null);
  };

  return (
    <>
      <header className="site-header">
        <div className="container navigation">
          <a href="#accueil" className="logo"><span className="logo-icon">N<span>.</span></span><span>N-13<span className="accent"> BIGSHOP</span></span></a>
          <nav className="nav-links"><a href="#accueil">Accueil</a><a href="#boutique">Boutique</a><a href="#apropos">À propos</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav>
          <button className="cart-btn" onClick={() => setShowPanier(true)}>🛒 Panier {totalQte > 0 && <span className="cart-badge">{totalQte}</span>} {total > 0 && <span>• {total}$</span>}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-glow" />
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="eyebrow"><span className="eyebrow-dot" />BOUTIQUE À GOMA • 0984 506 008</span>
              <h1>La plus grande boutique de <span>Goma.</span></h1>
              <p className="hero-description">Cherche, filtre par prix, ajoute au panier. iPhone XR jusqu&apos;à iPhone 17 Pro Max, Jordan, Baggy, Air Force...</p>
              <div className="hero-search">
                <input placeholder="🔍 Cherche : iPhone 13, Jordan, Baggy..." value={recherche} onChange={(e) => { setRecherche(e.target.value); if (e.target.value) document.getElementById("boutique")?.scrollIntoView({ behavior: "smooth" }); }} />
                {recherche && <button onClick={() => setRecherche("")}>✕</button>}
              </div>
              <div className="hero-actions"><a href="#boutique" className="button button-primary">Voir la boutique ↗</a><button className="button button-outline" onClick={() => setShowPanier(true)}>🛒 Panier {totalQte > 0 && `(${totalQte})`}</button></div>
              <div className="hero-note"><span className="note-line" />Recherche + Panier + Livraison précise</div>
              <div className="stats"><div><strong>500+</strong><span>Clients à Goma</span></div><div><strong>50+</strong><span>Articles</span></div><div><strong>30 sec</strong><span>Pour commander</span></div></div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
              <div className="center-core"><span className="core-symbol">N-13</span></div>
              <div className="floating-tag floating-tag-one"><span className="tag-dot" /> IPHONE 17 PRO MAX - 1200$</div>
              <div className="floating-tag floating-tag-two">JORDAN 4 - 75$</div>
              <div className="floating-tag floating-tag-three">BAGGY - 25$</div>
              <div className="visual-grid" />
            </div>
          </div>
          <div className="container hero-bottom"><span>CHERCHER</span><span className="bottom-separator">✦</span><span>PANIER</span><span className="bottom-separator">✦</span><span>RECEVOIR</span></div>
        </section>

        <section className="section formations-section" id="boutique">
          <div className="container">
            <div className="section-heading"><div><span className="section-label">01 / NOTRE BOUTIQUE</span><h2>Choisis, mets au panier, <span>reçois.</span></h2></div><p>Recherche, filtre par budget, puis clique sur + Panier ou Acheter.</p></div>

            <div className="search-box">
              <input className="search-input" placeholder="🔍 Recherche un article... Ex: iPhone, Jordan, Baggy, Samsung" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
              <select value={budget} onChange={(e) => setBudget(e.target.value)}><option>Tous les prix</option><option>Moins de 50$</option><option>50$ - 200$</option><option>200$ - 500$</option><option>Plus de 500$</option></select>
              <select value={tri} onChange={(e) => setTri(e.target.value)}><option>Populaire</option><option>Moins cher</option><option>Plus cher</option></select>
              {(recherche || budget !== "Tous") && <button className="btn-reset" onClick={() => { setRecherche(""); setBudget("Tous"); setTri("Populaire"); }}>Effacer ✕</button>}
            </div>
            <div className="search-tags"><span>Populaire :</span>{["iPhone 13", "Jordan", "Baggy", "Samsung", "Air Force", "Tecno"].map((t) => (<button key={t} onClick={() => setRecherche(t)}>{t}</button>))}</div>

            {!enRecherche && (
              <>
                <div className="tabs">{Object.keys(data).map((c) => (<button key={c} className={cat === c ? "tab active" : "tab"} onClick={() => { setCat(c); setMarque(Object.keys(data[c])[0]); }}>{c}</button>))}</div>
                <div className="pills">{marques.map((m) => (<button key={m} className={marque === m ? "pill active" : "pill"} onClick={() => setMarque(m)}>{m}</button>))}</div>
              </>
            )}

            <h3 className="shop-title">{enRecherche ? <>Résultats pour “{recherche}” <span>({affiches.length} trouvés)</span></> : <>{cat} → {marque} <span>({affiches.length} articles)</span></>}</h3>

            {affiches.length === 0 ? (
              <div className="no-result"><h3>😢 Aucun article trouvé</h3><p>Essaie un autre mot : iPhone, Jordan, Baggy, Samsung... ou change ton budget.</p><button className="btn-reset" onClick={() => { setRecherche(""); setBudget("Tous"); }}>Voir tous les articles</button></div>
            ) : (
              <div className="formation-grid">
                {affiches.map((it: Item) => (
                  <article className="formation-card product-card" key={it.nom}>
                    <div className="card-top"><span className="card-number">{it.cat} / {it.marque}</span><span className="card-icon">{it.cat === "Téléphones" ? "📱" : it.cat === "Vêtements" ? "👕" : it.cat === "Souliers" ? "👟" : "⌚"}</span></div>
                    <h3>{it.nom}</h3><p>Disponible à Goma. Livraison rapide. Paiement à la livraison.</p>
                    <div className="card-meta"><span>En stock</span><span>Goma</span></div>
                    <div className="card-actions"><button className="btn-buy" onClick={() => ouvrirAchatDirect(it)}>🛒 Acheter</button><button className="btn-cart" onClick={() => ajouterPanier(it)}>+ Panier</button></div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section about-section" id="apropos">
          <div className="container about-grid">
            <div><span className="section-label">02 / NOTRE APPROCHE</span><h2>Plus qu&apos;une boutique. <span>Un service pour Goma.</span></h2><p className="about-lead">Recherche + Panier + Formulaire précis = livraison sans erreur.</p><a href="https://wa.me/243984506008" target="_blank" className="text-link">Parlons de ta commande ↗</a></div>
            <div className="advantages">
              <div className="advantage"><span className="advantage-number">01</span><div><h3>Recherche rapide</h3><p>Tape iPhone, Jordan ou Baggy et trouve en 1 seconde.</p></div></div>
              <div className="advantage"><span className="advantage-number">02</span><div><h3>Panier intelligent</h3><p>Ajoute plusieurs articles, vois le total en temps réel.</p></div></div>
              <div className="advantage"><span className="advantage-number">03</span><div><h3>Livraison rapide</h3><p>Partout à Goma. Tu payes à la livraison.</p></div></div>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container"><span className="section-label">02B / QUESTIONS FRÉQUENTES</span><h2>Questions fréquentes.</h2>
            <div className="faq-list">
              <article className="faq-item"><h3>Comment chercher un article ?</h3><p>Tape son nom dans la recherche, ou filtre par budget.</p></article>
              <article className="faq-item"><h3>Vous livrez où ?</h3><p>Partout à Goma : Himbi, Katindo, Virunga, Majengo, Ndosho.</p></article>
              <article className="faq-item"><h3>Comment payer ?</h3><p>Cash ou Mobile Money à la livraison.</p></article>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-box"><div><span className="section-label">03 / CONTACT</span><h2>Ta prochaine commande commence ici.</h2><p>WhatsApp : <strong>0984 506 008</strong></p></div>
            <div className="contact-actions"><a href="https://wa.me/243984506008" target="_blank" className="button button-whatsapp">Commander sur WhatsApp ↗</a><a href="tel:+243984506008" className="button button-light">Appeler : 0984 506 008</a></div>
          </div>
        </section>
      </main>

      {showPanier && (
        <div className="modal-bg" onClick={() => setShowPanier(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPanier(false)}>✕</button>
            <span className="section-label">TON PANIER N-13</span>
            <h2>🛒 Mon panier ({totalQte})</h2>
            {panier.length === 0 ? <p className="modal-sub">Ton panier est vide. Va dans la boutique et clique sur + Panier.</p> : <>
              {panier.map((item) => (
                <div className="cart-item" key={item.nom}>
                  <div><strong>{item.nom}</strong><span>{item.prix}$ / pièce</span></div>
                  <div className="qty"><button onClick={() => changerQte(item.nom, -1)}>−</button><span>{item.qte}</span><button onClick={() => changerQte(item.nom, 1)}>+</button></div>
                  <strong>{item.prix * item.qte}$</strong>
                  <button className="remove" onClick={() => retirer(item.nom)}>🗑️</button>
                </div>
              ))}
              <div className="cart-total"><span>Total</span><strong>{total}$</strong></div>
              <button className="btn-send" onClick={ouvrirCommandePanier}>✅ Commander tout ({total}$) sur WhatsApp</button>
              <button className="btn-clear" onClick={() => setPanier([])}>Vider le panier</button>
            </>}
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            <span className="section-label">COMMANDE N-13 BIGSHOP</span>
            <h2>{achatDirect ? `Acheter : ${achatDirect.nom}` : `Commander tout - ${total}$`}</h2>
            {!achatDirect && <div className="form-summary">{panier.map((i) => (<div key={i.nom}><span>{i.nom} x {i.qte}</span><span>{i.prix * i.qte}$</span></div>))}</div>}
            <label>Nom complet *</label><input placeholder="Ex: Jean Mukendi" value={nom} onChange={(e) => setNom(e.target.value)} />
            <div className="form-row"><div><label>Sexe *</label><select value={sexe} onChange={(e) => setSexe(e.target.value)}><option>Homme</option><option>Femme</option></select></div><div><label>Type d&apos;article</label><input value={achatDirect ? achatDirect.nom : "Panier - plusieurs articles"} readOnly /></div></div>
            <label>Téléphone WhatsApp *</label><input placeholder="Ex: 0970 123 456" value={tel} onChange={(e) => setTel(e.target.value)} />
            <label>Adresse de livraison à Goma *</label><input placeholder="Ex: Himbi, Avenue Mont Goma, N°12" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            <label>Taille / Couleur</label><input placeholder="Ex: Taille 42, Noire, 128Go..." value={taille} onChange={(e) => setTaille(e.target.value)} />
            <label>Note</label><textarea placeholder="Ex: Appeler avant d'arriver..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn-send" onClick={envoyerCommande}>✅ Envoyer ma commande sur WhatsApp</button>
            <p className="modal-note">WhatsApp s&apos;ouvre avec ta commande déjà écrite.</p>
          </div>
        </div>
      )}

      <button className="wa-float" onClick={() => setShowPanier(true)}>🛒{totalQte > 0 && <span className="cart-badge float-badge">{totalQte}</span>}</button>
      <footer className="footer"><div className="container footer-inner"><a href="#accueil" className="logo"><span className="logo-icon">N<span>.</span></span><span>N-13<span className="accent"> BIGSHOP</span></span></a><p>© 2026 N-13 BIGSHOP. Goma, RDC.</p><a href="#accueil">Retour en haut ↑</a></div></footer>
    </>
  );
}
