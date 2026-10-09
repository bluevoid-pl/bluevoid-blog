---
title: "Muse Glimmer 30B - pruned GGUF"
description: "Simple description of bluevoid-pl/Muse-Glimmer-30B-pruned-GGUF: a pruned, latin-only quantized build of Meta's Muse Glimmer 30B agentic model."
date: "2026-08-26"
tags:
  - "Muse"
  - "GGUF"
  - "Model"
  - "Pruning"
---

### Muse Glimmer 30B - pruned

Pruned GGUF build of [meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B), published by bluevoid-pl.

- Base model: `meta-models/Muse-Glimmer-30B`
- Size: 27B params
- Architecture: muse-glimmer
- License: Apache 2.0
- HF: [bluevoid-pl/Muse-Glimmer-30B-pruned-GGUF](https://huggingface.co/bluevoid-pl/Muse-Glimmer-30B-pruned-GGUF)

#### Czym is

Muse Glimmer is a 30B causal language model built for autonomous agentic tasks on consumer hardware. It combines multi-step reasoning, reliable tool use, multimodal input (text + images) and failure recovery into a single model that runs locally without cloud infrastructure.

#### Pruning

This GGUF is pruned:

- Only latin characters are kept, so emojis and non-latin scripts are physically removed (model still thinks it can output them).
- Pruning reduces model size by ~25%, so it fits on limited VRAM.
- No guarantee of any kind that this GGUF works at all. It might break or die for no reason.

#### Running

Requires llama.cpp newer than `b10430`; older versions fail to load. Support in llama.cpp and ollama is partial - prefer the web interface over the CLI. On first start llama.cpp may hang for ~5min and warn `special_eot_id is not in special_eog_ids` - that warning is expected.

```bash
ollama run hf.co/bluevoid-pl/Muse-Glimmer-30B-pruned-GGUF:Q4_K_M
```

#### Quantizations

| Quant   | Size    |
| ------- | ------- |
| IQ2_XXS | 7.5 GB  |
| IQ2_XS  | 8.26 GB |
| IQ2_S   | 8.63 GB |
| IQ2_M   | 9.35 GB |
| Q2_K_S  | 9.51 GB |
| Q2_K    | 10.2 GB |
| IQ3_XXS | 10.6 GB |
| IQ3_XS  | 11.4 GB |
| Q3_K_S  | 12.0 GB |
| IQ3_S   | 12.0 GB |
| IQ3_M   | 12.3 GB |
| Q3_K_M  | 13.1 GB |
| Q3_K_L  | 14.1 GB |
| IQ4_XS  | 14.6 GB |
| Q4_0    | 15.5 GB |
| Q4_K_S  | 15.5 GB |
| Q4_K_M  | 16.3 GB |
| Q4_1    | 17.0 GB |
| Q8_0    | 28.7 GB |
| BF16    | 53.9 GB |
