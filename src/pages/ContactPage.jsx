import { useState, useRef, useEffect } from "react"
import styles from './ContactPage.module.css'

function useReveal() {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.1 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return [ref, visible]
}

const CHANNELS = [
    {
        label: "WhatsApp", detail: "Fastest response",
        href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`,
        icon: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>),
    },
    {
        label: "Email", detail: "hello@zeno.ng", href: "mailto:hello@zeno.ng",
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>),
    },
    {
        label: "Instagram", detail: "@zeno.ng", href: "https://instagram.com/zeno.ng",
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>),
    },
]

const FAQS = [
    { q: "How long does delivery take?", a: "We deliver within Lagos in 24 hours. Other states take 2–4 business days." },
    { q: "Are your products authentic?", a: "100%. Every product is sourced directly or through verified distributors. We do not stock grey market goods." },
    { q: "Can I return a product?", a: "Yes — within 7 days of delivery if the product is unopened and in original condition. See our return policy for details." },
    { q: "Do you offer bulk or business orders?", a: "Yes. Send us an email at hello@zeno.ng with your requirements and we'll put together a quote within 24 hours." },
]

export default function Contact() {
    const [formRef, formVisible] = useReveal()
    const [faqRef, faqVisible] = useReveal()

    const [form, setForm] = useState({ name: "", email: "", message: "" })
    const [status, setStatus] = useState(null)
    const [openFaq, setOpenFaq] = useState(null)

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus("sending")
        await new Promise(r => setTimeout(r, 1200))
        setStatus("sent")
    }

    return (
        <main className={styles.page}>

            <section className={styles.hero}>
                <div className={styles.heroGrid} aria-hidden="true" />
                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>Get in touch</span>
                    <h1 className={styles.heroHeadline}>
                        We're here.<br />
                        <span className={styles.accent}>Always.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Whether you have a question, a return, or just want
                        to know what to buy — reach out. We respond fast.
                    </p>
                </div>
            </section>

            <section className={styles.channels}>
                <div className={styles.channelsInner}>
                    {CHANNELS.map(({ label, detail, href, icon }, i) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.channelCard}
                            style={{ "--i": i }}
                            data-index={i + 1}
                        >
                            <span className={styles.channelIcon}>{icon}</span>
                            <div className={styles.channelText}>
                                <span className={styles.channelLabel}>{label}</span>
                                <span className={styles.channelDetail}>{detail}</span>
                            </div>
                            <span className={styles.channelArrow} aria-hidden="true">→</span>
                        </a>
                    ))}
                </div>
            </section>

            <section
                ref={formRef}
                className={`${styles.formSection} ${formVisible ? styles.visible : ""}`}
            >
                <div className={styles.formInner}>

                    <div className={styles.formContext}>
                        <div className={styles.formHeader}>
                            <span className={styles.sectionEyebrow}>Send a message</span>
                            <h2 className={styles.sectionHeading}>Write to us.</h2>
                        </div>
                        <p className={styles.formContextNote}>
                            Have a question about a product, an order,
                            or just want to say hello? We read every message.
                        </p>
                        <div className={styles.responseTime}>
                            <span className={styles.responseDot} aria-hidden="true" />
                            <span className={styles.responseText}>
                                Typically replies within 2 hours
                            </span>
                        </div>
                    </div>

                    <div className={styles.formRight}>
                        {status === "sent" ? (
                            <div className={styles.successState}>
                                <span className={styles.successDot} />
                                <p className={styles.successTitle}>Message received.</p>
                                <p className={styles.successSub}>We'll be in touch within 24 hours.</p>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label className={styles.label} htmlFor="name">Name</label>
                                        <input id="name" name="name" type="text" className={styles.input}
                                            placeholder="Your name" value={form.name}
                                            onChange={handleChange} required autoComplete="name" />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label} htmlFor="email">Email</label>
                                        <input id="email" name="email" type="email" className={styles.input}
                                            placeholder="your@email.com" value={form.email}
                                            onChange={handleChange} required autoComplete="email" />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label} htmlFor="message">Message</label>
                                    <textarea id="message" name="message" className={styles.textarea}
                                        placeholder="What can we help you with?" rows={5}
                                        value={form.message} onChange={handleChange} required />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
                                    <span>{status === "sending" ? "Sending…" : "Send message"}</span>
                                    {status !== "sending" && <span className={styles.btnArrow}>→</span>}
                                    {status === "sending" && <span className={styles.spinner} aria-hidden="true" />}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            <section
                ref={faqRef}
                className={`${styles.faqSection} ${faqVisible ? styles.visible : ""}`}
            >
                <div className={styles.faqInner}>
                    <div className={styles.faqHeader}>
                        <span className={styles.sectionEyebrow}>Quick answers</span>
                        <h2 className={styles.sectionHeading}>FAQ.</h2>
                    </div>
                    <div className={styles.faqList}>
                        {FAQS.map(({ q, a }, i) => (
                            <div
                                key={i}
                                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}
                            >
                                <button
                                    className={styles.faqQ}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    aria-expanded={openFaq === i}
                                >
                                    <span>{q}</span>
                                    <span className={styles.faqIcon} aria-hidden="true">+</span>
                                </button>
                                <div className={styles.faqA}>
                                    <p>{a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    )
}