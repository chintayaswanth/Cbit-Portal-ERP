import { useState } from "react";
import "../css/papers.css";

function Papers() {
    const papers = [
        { title: "B.E. Question Papers", link: "https://spdc.cbit.org.in/course/view.php?id=227" },
        { title: "M.E/M.Tech Question Papers", link: "https://spdc.cbit.org.in/course/view.php?id=228" },
        { title: "MBA Question Papers", link: "https://spdc.cbit.org.in/course/view.php?id=229" },
        { title: "MCA Question Papers", link: "https://spdc.cbit.org.in/course/view.php?id=230" },
    ];

    const [modal, setModal] = useState(null);

    return (
        <div className="papers-container">
            <h1 className="papers-heading">
                CBIT Previous Year Question Papers
            </h1>

            <div className="papers-grid">
                {papers.map((paper) => (
                    <button
                        key={paper.title}
                        className="paper-card"
                        onClick={() => setModal(paper)}
                    >
                        <div className="paper-image"></div>
                        <div className="paper-title">{paper.title}</div>
                    </button>
                ))}
            </div>

            {modal && (
                <div
                    className="papers-modal-overlay"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="papers-modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="papers-modal-badge">
                            ✓ Official CBIT Portal
                        </div>

                        <p className="papers-modal-heading">
                            ⚠️ Opening {modal.title}
                        </p>

                        <p className="papers-modal-body">
                            This is the official CBIT question paper portal.
                            The website uses an expired SSL certificate, so your
                            browser will display a security warning before
                            opening the page. This is expected. Follow the steps
                            below to continue.
                        </p>

                        <p className="papers-modal-steps-label">
                            HOW TO ACCESS
                        </p>

                        <ol className="papers-modal-steps">
                            <li>
                                <span className="step-num">1</span>
                                Click <code>Advanced</code> on the browser
                                warning page.
                            </li>

                            <li>
                                <span className="step-num">2</span>
                                Click{" "}
                                <code>
                                    Proceed to spdc.cbit.org.in (unsafe)
                                </code>
                            </li>
                        </ol>

                        <div className="papers-modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setModal(null)}
                            >
                                Cancel
                            </button>

                            <a
                                className="btn-proceed"
                                href={modal.link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setModal(null)}
                            >
                                Open Anyway
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Papers;