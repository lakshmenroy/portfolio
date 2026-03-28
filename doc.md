# Dataset Pipeline Summary
## Merge → Split → Balance → KITTI Conversion → Training Plan

Generated: 2026-03-28

---

## 1. Source Data & Merge

The input to the pipeline was a **merged pool** assembled by `merge_and_split_master_dataset.ipynb`.
That notebook took multiple labelled clip directories (CVAT format), removed empty/unlabelled frames,
and merged them into one flat unsplit CVAT dataset using Datumaro's union merge policy. Images were
not copied — symlinks were used to save disk. The master sources were cryptographically fingerprinted
(SHA-256) before and after to confirm nothing was corrupted during the merge.

**Merged pool output:**
```
/workspace/master_dataset/DATA/merged_pool_20260327_093735/
    annotations.xml
    images/            ← symlinks to original clip images
```

**Total: 224,092 frames, 275,941 annotations**

**Label distribution in the merged pool (annotation level):**

| Label | Annotations | % of all annotations | Frames containing label | % of all frames |
|---|---|---|---|---|
| `nozzle_clear` | 174,587 | 63.3% | 174,583 | 77.9% |
| `action_object` | 52,726 | 19.1% | 46,310 | 20.7% |
| `nozzle_blocked` | 45,237 | 16.4% | 45,236 | 20.2% |
| `check_nozzle` | 3,391 | 1.2% | 3,391 | 1.5% |

A frame can contain multiple labels simultaneously (e.g. `nozzle_blocked` + `action_object`),
so frame percentages do not sum to 100%.

**Frame-level label signature distribution (all labels present per frame):**

| Signature | Frames | % |
|---|---|---|
| `nozzle_clear` only | 167,712 | 74.8% |
| `action_object` + `nozzle_blocked` (lo density) | 33,086 | 14.8% |
| `nozzle_blocked` only | 6,809 | 3.0% |
| `action_object` + `nozzle_clear` (lo density) | 6,339 | 2.8% |
| `action_object` + `nozzle_blocked` (hi density) | 5,314 | 2.4% |
| `check_nozzle` only | 3,158 | 1.4% |
| `action_object` only | 991 | 0.4% |
| `action_object` + `nozzle_clear` (hi density) | 425 | 0.2% |
| Rare multi-label combos (6 signatures, <10 frames each) | 133 | 0.1% |

---

## 2. Stratified Split — 70 / 15 / 15

**Script:** `notebooks/split_master_dataset.py`
**Log:** `split_master_dataset.log`

The split was done at frame level using scikit-learn's `train_test_split` with stratification on
**label signatures** — the full sorted set of labels present in each frame, not just the dominant
class. This preserved co-occurrence patterns. `action_object` was additionally split into `lo`
(1 box) and `hi` (2+ boxes) density buckets so multi-object harder examples were distributed
proportionally across all three splits.

6 frames from 2 ultra-rare signatures (1 and 5 frames) were merged into a `_rare` bucket to allow
sklearn to stratify without errors.

**Result:**

| Split | Frames | Annotations | Avg ann/frame |
|---|---|---|---|
| Train | 156,864 | 193,159 | 1.23 |
| Validation | 33,614 | 41,391 | 1.23 |
| Test | 33,614 | 41,391 | 1.23 |
| **Total** | **224,092** | **275,941** | **1.23** |

**Max class-% deviation from pool: 0.00%** — stratification was perfect.

Images were exported as **real file copies** (symlinks from the merged pool were resolved).
Each split is fully self-contained on disk.

---

## 3. Balanced Train Subset

**Script:** `notebooks/balance_train_split.py`
**Log:** `balance_train_split.log`

**Operationally, the two classes that matter are `nozzle_clear` and `nozzle_blocked`.**
`check_nozzle` is a minor class (~1.5% of data) and not a training priority.
`action_object` is a co-occurring context label, not a nozzle state indicator.

The key ratio in the full Train is:
- `nozzle_clear`: 117,398 frames (74.8%)
- `nozzle_blocked`: 31,666 frames (20.2%)
- **Ratio: 3.71:1** — manageable with focal loss, but worth testing a balanced version

**Strategy:** Keep 100% of every frame that contains `nozzle_blocked`, `action_object`,
`check_nozzle`, or any multi-label combination. Only subsample frames whose **sole label is
`nozzle_clear`**, targeting roughly 1:1 parity with `nozzle_blocked`.

- Pure `nozzle_clear` frames in Train: **117,398**
- Target to keep: **31,666** (matching nozzle_blocked frame count, seed=42)
- All other frames kept intact: **39,466**
- **Train_balanced total: 71,132 frames**

Images in `Train_balanced/images/` are **symlinks → `Train/images/`** — no disk duplication.

**Label presence after balancing:**

| Label | Full Train frames | Full Train % | Train_balanced frames | Train_balanced % |
|---|---|---|---|---|
| `nozzle_clear` | 117,398 | 74.8% | 36,475 | 51.3% |
| `action_object` | 32,415 | 20.7% | 32,415 | 45.6% |
| `nozzle_blocked` | 31,666 | 20.2% | 31,666 | 44.5% |
| `check_nozzle` | 2,374 | 1.4% | 2,374 | 3.3% |

`nozzle_clear` (36,475) vs `nozzle_blocked` (31,666) → **ratio 1.15:1** — effectively balanced.
`check_nozzle` and `action_object` are identical in both splits (nothing removed from them).

---

## 4. KITTI Conversion

**Script:** `notebooks/cvat_to_kitti.py`
**Log:** `cvat_to_kitti.log`

All four splits converted from CVAT XML to KITTI `.txt` format by parsing `annotations.xml`
directly — no Datumaro. Writes exactly 15 fields from the start (avoids the 16-field Datumaro
bug that older pipeline versions had to fix post-hoc).

**KITTI label format (15 fields):**
```
type  truncated  occluded  alpha  left  top  right  bottom  height  width  length  x  y  z  rotation_y
nozzle_clear 0.0 0 -1 30.34 308.81 788.49 607.43 -1 -1 -1 -1 -1 -1 -1
```
3D fields set to `-1` (2D detection task). Box coordinates taken directly from CVAT
`xtl`/`ytl`/`xbr`/`ybr` at full float precision.

**Image symlink chain — zero file copies at any stage:**
```
Train/kitti_format/annotations/
    image_2  →  ../../images/                           (dir symlink → real files)

Train_balanced/kitti_format/annotations/
    image_2  →  ../../images/                           (dir symlink)
        └── Train_balanced/images/N.png  →  ../../Train/images/X.png   (per-file symlinks)
                └── Train/images/X.png                                  (one physical file)
```

**Final KITTI output:**

| Split | label_2 files | Annotations | Sync |
|---|---|---|---|
| Train | 156,864 | 193,159 | ✓ |
| Train_balanced | 71,132 | 107,424 | ✓ |
| Validation | 33,614 | 41,391 | ✓ |
| Test | 33,614 | 41,391 | ✓ |

---

## 5. Final Dataset Structure on Disk

```
master_dataset_20260327_222350/
├── Train/
│   ├── annotations.xml                   CVAT, 156,864 frames
│   ├── images/                           real PNG files: 0.png … 156863.png
│   └── kitti_format/annotations/
│       ├── label_2/                      156,864 × .txt (15-field KITTI)
│       └── image_2  →  ../../images/
│
├── Train_balanced/
│   ├── annotations.xml                   CVAT, 71,132 frames, reindexed 0…71131
│   ├── images/                           symlinks → Train/images/
│   └── kitti_format/annotations/
│       ├── label_2/                      71,132 × .txt
│       └── image_2  →  ../../images/
│
├── Validation/
│   ├── annotations.xml                   CVAT, 33,614 frames
│   ├── images/                           real PNG files
│   └── kitti_format/annotations/
│       ├── label_2/                      33,614 × .txt
│       └── image_2  →  ../../images/
│
└── Test/
    ├── annotations.xml                   CVAT, 33,614 frames
    ├── images/                           real PNG files
    └── kitti_format/annotations/
        ├── label_2/                      33,614 × .txt
        └── image_2  →  ../../images/
```

**Labels (4 classes, same index order in all splits):**
1. `nozzle_clear`
2. `check_nozzle`
3. `nozzle_blocked`
4. `action_object`

**Image filename format:** plain integers, no zero-padding: `0.png`, `1.png`, ..., `N.png`
**Label filename format:** same stem as image: `0.txt`, `1.txt`, ..., `N.txt`

---

## 6. Training Plan — Two Candidate Models

Both candidates use the **same architecture, same hyperparameters, same Val and Test sets**.
Only the training data differs.

### Candidate A — Full Train
- **Path:** `Train/kitti_format/`
- **Frames:** 156,864
- **nozzle_clear : nozzle_blocked ratio:** 3.71:1
- **Advantage:** Maximum volume and diversity. Sees all variants of nozzle_clear, including
  visually hard edge cases and subtle clear/blocked boundary frames. Distribution matches
  real-world deployment (more clear than blocked is the natural state).
- **Risk:** 3.71:1 ratio could cause slight under-weighting of nozzle_blocked. Mitigated by
  focal loss in modern detectors.

### Candidate B — Balanced Train
- **Path:** `Train_balanced/kitti_format/`
- **Frames:** 71,132
- **nozzle_clear : nozzle_blocked ratio:** 1.15:1 (near 1:1)
- **Advantage:** Equal gradient exposure to both key classes. Model cannot lean on frequency
  bias to predict nozzle_clear.
- **Risk:** 85,732 nozzle_clear frames removed. Model sees a narrower slice of what nozzle_clear
  looks like — may miss edge cases and subtle clear states, potentially over-predicting blocked
  when the nozzle is actually clear.

### Evaluation
Both candidates evaluated on `Test/kitti_format/` (33,614 frames, real-world distribution).

**Primary metrics:**
- mAP overall
- AP `nozzle_clear` — precision on the dominant real-world state
- AP `nozzle_blocked` — recall here is operationally critical (missing a blocked nozzle is costly)
- Confusion between `nozzle_clear` and `nozzle_blocked` — the key discriminative task

**Winner selection:** The candidate with better `nozzle_blocked` recall that does not
significantly hurt `nozzle_clear` precision. If comparable, Candidate A is preferred for
deployment due to broader training coverage of the dominant class.

---

## 7. Honest Critique — The Flaws

### Flaw 1 (Critical): Temporal Correlation — 30fps Video Extraction

This is the most serious issue and was **not addressed at any stage**.

Data was extracted from videos at 30fps. Adjacent frames from the same video are nearly identical
at the pixel level. The stratified split was done at **frame level with no awareness of which
clip each frame came from**. This means frame N and frame N+1 from the same clip can be in Train
and Val/Test respectively.

The model does not need to generalise — it matches near-duplicates of training frames. **Val and
Test metrics will be optimistic.** True generalisation is only revealed on entirely new footage.

At 30fps, 3,391 `check_nozzle` frames ≈ ~113 seconds of footage. 156,864 Train frames ≈ ~87
minutes of video, but with massive redundancy. The effective unique visual information is much
less than the frame count implies.

**What would fix this:** Split by clip/video, not by frame. Hold out entire clips for Val/Test.
Metrics would drop but become trustworthy for deployment prediction.

### Flaw 2: The Balancing Decision Removed 85,732 Frames Randomly

The 31,666 kept pure-nozzle_clear frames were selected **uniformly at random** (seed=42).
No consideration was given to:

- Which nozzle_clear frames are visually easy vs ambiguous (near-blocked appearance)
- Which frames are near-duplicates vs unique visual contexts
- Whether the removed frames contain the hard boundary cases the model most needs to learn

The visually hard cases — frames that look blocked but are clear, or vice versa, labelled
correctly through human expertise — are exactly the frames that define the clear/blocked
decision boundary. Some of those may have been among the 85,732 randomly removed frames.

This is the fundamental difficulty: a balanced dataset is hard to construct when the hardest
examples are in the majority class and random removal discards them without preference.

### Flaw 3: action_object Is a Co-occurring Context Label

`action_object` marks that something is happening near the nozzle (hand, tool, object in frame).
It always co-occurs with `nozzle_clear` or `nozzle_blocked` — it is not a nozzle state.

In `Train_balanced`, `action_object` appears in 45.6% of frames vs `nozzle_blocked` in 44.5%.
The model may learn: "action_object present → likely nozzle_blocked" because that co-occurrence
(26,880 frames in full Train) is very common. In reality, action_object does not determine nozzle
state. This is a dataset composition issue; cannot be fixed without changing the labelling strategy.

### Flaw 4: check_nozzle Is Not a Training Priority But Still Consumes Label Space

`check_nozzle` is present in all splits and occupies label index 2. The model will train on it
regardless. With only 2,374 training examples across potentially ~79 seconds of footage, the
model's check_nozzle predictions will be unreliable. This is acceptable given the operational
context, but the label should not be used as a reliable signal in the downstream pipeline.

---

## 8. Key Numbers for Training Script Configuration

| Parameter | Value |
|---|---|
| Total labelled frames | 224,092 |
| Total annotations | 275,941 |
| Train (full) frames | 156,864 |
| Train_balanced frames | 71,132 |
| Validation frames | 33,614 |
| Test frames | 33,614 |
| Number of classes | 4 |
| Class names (in order) | nozzle_clear, check_nozzle, nozzle_blocked, action_object |
| Random seed (all operations) | 42 |
| nozzle_clear target in Train_balanced | 31,666 |
| Image format | PNG |
| Image naming | plain integers, no zero-padding: 0.png, 1.png, ... |
| KITTI label fields | 15 (no confidence score) |
| 3D fields in KITTI labels | all -1 |
| image_2 | directory symlink → ../../images/ |
| label_2 | one .txt per frame, stem matches image stem |

---

## 9. Central Uncertainty Carried Into Training

Val/Test metrics will be flattering due to temporal correlation (30fps, frame-level split).
Both candidates will show high mAP on Test, partly because near-duplicate frames from the same
clips appear in both Train and Test.

**Candidate A** is the safer deployment bet — it trained on the real distribution, saw more
nozzle_clear diversity, and its training distribution matches what the nozzle will look like
most of the time in production.

**Candidate B** will likely show marginally better nozzle_blocked metrics on the Test split,
but this partly reflects temporal correlation rather than true generalisation. It is worth
running to confirm whether the balancing helps or hurts in practice.

The definitive test of either model is deployment on **new, never-before-seen video footage**,
not the Test split metrics.
