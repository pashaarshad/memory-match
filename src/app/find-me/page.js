"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function FindMePage() {
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);

  const preview = useMemo(() => {
    if (!selfie) return "";
    return URL.createObjectURL(selfie);
  }, [selfie]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!selfie) {
      setMessage("Please choose a selfie first.");
      return;
    }

    const formData = new FormData();
    formData.append("selfie", selfie);

    setLoading(true);
    setMessage("Matching faces from dataset...");
    setMatches([]);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Matching failed");
      }

      setMatches(data.matches || []);
      setMessage(data.message || "Completed");
    } catch (error) {
      setMessage(error.message || "Failed to match faces.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Find My Photos</h1>
      <p>Upload one selfie and find matching photos from public/dataset.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelfie(e.target.files?.[0] || null)}
        />
        <button disabled={loading} style={{ marginLeft: 12 }} type="submit">
          {loading ? "Analyzing..." : "Find Matches"}
        </button>
      </form>

      {preview ? (
        <div style={{ marginTop: 16 }}>
          <h3>Selfie Preview</h3>
          <Image
            src={preview}
            alt="Uploaded selfie"
            width={260}
            height={260}
            unoptimized
            style={{ borderRadius: 8, height: "auto" }}
          />
        </div>
      ) : null}

      {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}

      {matches.length > 0 ? (
        <section style={{ marginTop: 20 }}>
          <h2>Matched Images</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {matches.map((item) => (
              <figure key={item.path} style={{ margin: 0 }}>
                <Image
                  src={item.path}
                  alt={item.fileName}
                  width={320}
                  height={220}
                  style={{ width: "100%", height: "auto", borderRadius: 8 }}
                />
                <figcaption>{item.fileName}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
