---
title: "Muse Glimmer 30B - pruned V2.5 EN-PL GGUF"
description: "Simple description of bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF: a pruned, English+Polish quantized build of Meta's Muse Glimmer 30B agentic model with vision."
date: "2026-10-27"
img: "/placeholder.png"
tags:
  - "Muse"
  - "GGUF"
  - "Model"
  - "Pruning"
  - "Vision"
enabled: true
---

# Muse Glimmer 30B - pruned V2.5 EN-PL GGUF

Pruned GGUF build of [meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B), published by bluevoid-pl.

- Base model: `meta-models/Muse-Glimmer-30B`
- Size: 27B params
- Architecture: muse-glimmer
- License: Apache 2.0
- HF: [bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF](https://huggingface.co/bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF)

#### Overview

Muse Glimmer is a 30B causal language model with a dedicated perception encoder, distilled from Muse Spark and purpose-built for autonomous agentic tasks on consumer hardware. The model integrates multi-step reasoning, reliable tool use, multimodal understanding, and failure recovery into a single model that runs locally without requiring cloud infrastructure or network access.

This V2.5 build adds vision support and prunes to English + Polish characters only.

#### Pruning

This GGUF is pruned:

- Only English and Polish characters are kept, so emojis and non-latin scripts are physically removed (model still thinks it can output them).
- Pruning reduces model size by ~25%, so it fits on limited VRAM.
- No guarantee of any kind that this GGUF works at all. It might break or die for no reason.

Vision capabilities are restored compared to previous versions. Vision requires downloading `mmproj-*` file. Quantization of vision models usually compound error, so it's recommended to use Q8_0 for vision regardless of your text-text quantization level. Correct file is: `mmproj-Muse-Glimmer-30B_pruned-pl-V2.5-Q8_0.gguf`.

Note: This model is using English thinking, because of that using Polish language in your prompt is not ideal.

#### Running

Requires llama.cpp newer than `b10430`; older versions fail to load. Support in llama.cpp and ollama is partial - prefer the web interface over the CLI. On first start llama.cpp may hang for ~5min and warn `special_eot_id is not in special_eog_ids` - that warning is expected.

##### Text-only (no vision)

**llama.cpp CLI**
```bash
./llama-cli -m Muse-Glimmer-30B-pruned-V2.5-en-pl-IQ3_XXS.gguf -n 512 --temp 0.6 --jinja
```

**llama-server for 12Gb VRAM**
```bash
./llama-server -m Muse-Glimmer-30B-pruned-V2.5-en-pl-IQ3_XXS.gguf --alias "default" --ctx-size 100000 --threads 6 --jinja -ngl 53 --host 0.0.0.0 --port 13378 --api-key "APIKEY" --parallel 1 --temp 0.6 --reasoning-preserve
```

**Ollama**
```bash
ollama run hf.co/bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF:IQ3_XXS
```

##### With vision

Vision requires the `mmproj` file: `mmproj-Muse-Glimmer-30B_pruned-pl-V2.5-Q8_0.gguf`. Quantization of vision models compounds error, so use Q8_0 for vision regardless of text quantization.

**llama.cpp CLI**
```bash
./llama-cli -m Muse-Glimmer-30B-pruned-V2.5-en-pl-Q8_0.gguf --mmproj mmproj-Muse-Glimmer-30B_pruned-pl-V2.5-Q8_0.gguf -n 512 --temp 0.6 --jinja
```

**llama-server**
```bash
./llama-server -m Muse-Glimmer-30B-pruned-V2.5-en-pl-Q8_0.gguf --mmproj mmproj-Muse-Glimmer-30B_pruned-pl-V2.5-Q8_0.gguf --alias "default" --ctx-size 100000 --threads 6 --jinja -ngl 53 --host 0.0.0.0 --port 13378 --api-key "APIKEY" --parallel 1 --temp 0.6 --reasoning-preserve
```

**Ollama** (vision support is experimental)
```bash
ollama run hf.co/bluevoid-pl/Muse-Glimmer-30B-pruned-V2.5-en-pl-GGUF:Q8_0
```

**Recommendations for vision**
- Use Q8_0 quantization for the model and mmproj to minimize vision errors.
- Keep `mmproj` file alongside the GGUF and ensure llama.cpp >= b10430.
- For high-resolution images, increase `--ctx-size` and reduce `--parallel` to avoid OOM.
- Vision performance is best with `--jinja` and `--reasoning-preserve` enabled.

#### Quantizations

| Quant   | Size    |
| ------- | ------- |
| IQ2_XXS | 7.52 GB |
| IQ2_XS  | 8.28 GB |
| IQ2_S   | 8.65 GB |
| IQ2_M   | 9.37 GB |
| Q2_K_S  | 9.53 GB |
| Q2_K    | 10.2 GB |
| IQ3_XXS | 10.7 GB |
| IQ3_XS  | 11.4 GB |
| IQ3_S   | 12 GB   |
| Q3_K_S  | 12 GB   |
| IQ3_M   | 12.3 GB |
| Q3_K_M  | 13.1 GB |
| Q3_K_L  | 14.1 GB |
| IQ4_XS  | 14.6 GB |
| Q4_K_S  | 15.5 GB |
| IQ4_NL  | 15.5 GB |
| Q4_0    | 15.5 GB |
| Q4_1    | 17.1 GB |
| Q4_K_M  | 16.3 GB |
| Q8_0    | 28.7 GB |
| BF16    | 54 GB   |
