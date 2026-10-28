
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("ERROR: API key tidak ditemukan.");
    return;
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Percobaan ${attempt}/3...`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Reply with exactly OK" }],
            },
          ],
        }),
        signal: AbortSignal.timeout(30000),
      });

      const body = await response.text();

      console.log("HTTP STATUS:", response.status);

      if (response.ok) {
        console.log("RESPONSE:", body);
        return;
      }

      console.log("RESPONSE:", body);

      if (![429, 500, 502, 503, 504].includes(response.status)) {
        return;
      }
    } catch (error) {
      console.log("NETWORK ERROR:", error.message);
      console.log("CAUSE CODE:", error.cause?.code || "none");
      console.log("CAUSE MESSAGE:", error.cause?.message || "none");
    }

    if (attempt < 3) {
      const waitMs = 2000 * 2 ** (attempt - 1);
      console.log(`Mencoba kembali setelah ${waitMs / 1000} detik...`);
      await sleep(waitMs);
    }
  }

  console.log("GAGAL: Ketiga percobaan tidak berhasil.");
}

main();