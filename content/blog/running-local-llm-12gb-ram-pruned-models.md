---
title: "Running Local LLM on 12GB RAM with Pruned Models"
description: "Guide to running large language models locally on 12GB RAM using pruned GGUF models and llama.cpp, with examples for Muse-Glimmer-30B-pruned-V2.5-en-pl."
date: "2026-10-27"
img: "/placeholder.png"
tags:
  - "LLM"
  - "GGUF"
  - "Pruning"
  - "llama.cpp"
  - "RAM"
enabled: true
---

# Running Local LLM on 12GB RAM with Pruned Models

Running a capable large language model locally without a high-end GPU is possible with pruned and quantized GGUF models. This guide shows how to run a model like `Muse-Glimmer-30B-pruned-V2.5-en-pl-IQ3_XXS.gguf` on a machine with ~12GB RAM using `llama-server`.

## Prerequisites

- **llama.cpp** built from source or precompiled binary newer than `b10430`.
- GGUF model file downloaded (e.g., `Muse-Glimmer-30B-pruned-V2.5-en-pl-IQ3_XXS.gguf` ~10.7 GB).
- ~12GB free RAM + disk space for the model.
- Optional: `mmproj` file for vision support.

## Why Pruning Helps

Pruning removes rarely used characters/scripts from the tokenizer, reducing model size by ~25% without significant quality loss for English/Polish use. Combined with aggressive quantization (IQ3_XXS), the model fits in limited VRAM/RAM.

## Running llama-server

The following command starts a local OpenAI-compatible API server with settings tuned for 12GB RAM:

```bash
./llama-server -m Muse-Glimmer-30B-pruned-V2.5-en-pl-IQ3_XXS.gguf --alias "default" --ctx-size 100000 --threads 6 --jinja -ngl 53 --host 0.0.0.0 --port 13378 --api-key "APIKEY" --parallel 1 --temp 0.6 --reasoning-preserve
```

### Parameter breakdown

- `-m <model.gguf>`: path to the GGUF model.
- `--alias "default"`: model name in API responses.
- `--ctx-size 100000`: context window size. Large value allows long prompts; adjust down if RAM is tight.
- `--threads 6`: CPU threads to use. 6 is a good balance for consumer CPUs.
- `--jinja`: use Jinja templating for chat format.
- `-ngl 53`: number of layers offloaded to GPU. Set to 53 for CPU-only or partial GPU; adjust to your hardware.
- `--host 0.0.0.0 --port 13378`: bind server to all interfaces on port 13378.
- `--api-key "APIKEY"`: simple auth for the API.
- `--parallel 1`: process one request at a time to avoid OOM.
- `--temp 0.6`: temperature for generation.
- `--reasoning-preserve`: keep reasoning tokens in output.

## Text-only vs Vision

For text-only, use the IQ3_XXS quantization above.

For vision, use Q8_0 quantization and provide the `mmproj` file:

```bash
./llama-server -m Muse-Glimmer-30B-pruned-V2.5-en-pl-Q8_0.gguf --mmproj mmproj-Muse-Glimmer-30B_pruned-pl-V2.5-Q8_0.gguf --alias "default" --ctx-size 100000 --threads 6 --jinja -ngl 53 --host 0.0.0.0 --port 13378 --api-key "APIKEY" --parallel 1 --temp 0.6 --reasoning-preserve
```

**Vision recommendations:**
- Use Q8_0 for both model and mmproj to minimize quantization error.
- Keep `mmproj` alongside the GGUF.
- For high-resolution images, increase `--ctx-size` and reduce `--parallel` to avoid OOM.

## Tips for 12GB RAM

- Use IQ3_XXS or IQ3_S quantizations (~10-12 GB).
- Close other memory-hungry apps.
- Start with `-ngl 0` for CPU-only, increase if you have VRAM.
- Monitor RAM usage; if it spikes, reduce `--ctx-size` or `--threads`.

## Next Steps

- See the [Muse Glimmer 30B - pruned V2.5 EN-PL GGUF](/blog/muse-glimmer-pruned-v2-5-en-pl) article for model details and quantizations.
- For Ollama users: `ollama run hf.co/bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF:IQ3_XXS`
