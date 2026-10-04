# Curating GLOSSARY.md

`GLOSSARY.md` is a glossary: it fixes the words a project uses so that people and agents mean the same thing by them. Every rule below follows from that job. Use this file before adding an entry, and whenever asked to curate, prune or tighten an existing `GLOSSARY.md`.

## What earns an entry

A term earns an entry only when all three hold:

1. **Project vocabulary.** People on this project use the word, or the user just coined it. General programming concepts (timeout, retry, cache, queue) and library or vendor names do not qualify, however heavily the code uses them. The exception is a third-party name that collides with a project term (an off-the-shelf `Gateway` proxy beside the project's own gateway product): it gets an entry in a separate section for names that are not ours, saying which word is which.
2. **Misreadable.** A competent newcomer would guess its meaning wrong, or two people have used it for different things, or several words compete for one concept.
3. **Stable.** The meaning would survive a rewrite of the implementation. A concept that exists only because of how the code happens to work is not a term.

A candidate that fails the tests goes to its real home, and the glossary at most names the concept:

| It is... | It belongs in |
| --- | --- |
| how a thing works: a mechanism, a data shape, a flow | the code, a code comment, or a design doc |
| a hard-to-reverse choice with a real trade-off | an ADR |
| a rule that tells implementers what to build ("must", "never") | the spec |
| a step-by-step procedure | a runbook or skill |
| status, a date, a version, a ticket or PR number | the tracker or the changelog |
| a plan or a TODO | the tracker |
| how an ambiguity was argued out | nowhere: the resolution lives in the entry |

## Entry shape

- **One concept, one entry.** A competing word is an `_Avoid_` word on the winner, never an entry of its own.
- **A bold singular term**, then a definition of one or two sentences that says what the thing *is* (a kind, plus what sets it apart), never what it does or how it is built. A definition that needs a third sentence is two terms, or design-doc material. A constraint that tells the term apart from its neighbours ("never a column on the content table", "decides how much, never whether") stays in the definition, because it says what the thing is.
- **`_Avoid_`** lists the rejected synonyms and the words people wrongly use for it.
- **Bold the other terms** a definition uses. Relationships between terms go in the Relationships section, one line each with cardinality, never packed into a definition.
- The file describes the project **now**. No dates, no "formerly", no "updated in" notes: history lives in git.
- A definition that states how the code behaves is checked against the code before it is written.

## Sections

`Language` holds the entries. `Relationships` holds one line per relationship between entries. `Flagged ambiguities` holds only questions still open: when one is resolved, the resolution becomes the entry's definition and `_Avoid_` words, and the line is deleted.

## Keeping it from growing

- **Search before adding.** Look for the term and its synonyms. A hit means extend or correct that entry; a new entry is for a concept the file does not yet cover.
- **Rename in place.** The new name replaces the old one, and the old name becomes an `_Avoid_` word.
- **Delete what the project has dropped.** A term with no remaining use in the code, the docs or the conversation is removed. A retired term survives only as an `_Avoid_` word on its replacement.
- **Tripwire: about 40 entries or 250 lines in one file** (a first guess, adjust it with evidence). Past it, prune and merge before adding anything. A file that is still large after pruning and spans two areas a reader would not hold at once splits into contexts with a `GLOSSARY-MAP.md`; splitting a file that still carries implementation detail only multiplies the detail.
- **Size is a symptom.** A file that crossed the tripwire usually absorbed material from the table above, and routing that material out shrinks it faster than rewording does.

## Curating an existing file

1. Read the whole file. Run each entry through the three tests and the shape rules, and note each one that fails: cut, merge, rewrite, or route elsewhere.
2. Check each remaining term against the code and docs. A term with no remaining use is deleted.
3. Merge duplicates and synonym clusters into one entry each.
4. Move each routed-out item to its home before deleting it from the file.
5. Report what was removed or moved, and where it went, so the diff reviews in one read.
