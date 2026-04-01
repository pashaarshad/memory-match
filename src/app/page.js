import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.badge}>Face Finder MVP</p>
          <h1>Upload one photo and find matching faces in your dataset.</h1>
          <p>
            Put group images inside <strong>public/dataset</strong>. Then open the
            search page and upload a selfie to find related images.
          </p>
        </div>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/find-me">
            Open Face Search
          </Link>
        </div>
      </main>
    </div>
  );
}
