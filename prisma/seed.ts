import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.article.deleteMany()

  const articles = [
    {
      title: 'The Role of CRISPR in Modern Genetic Engineering',
      author: 'Dr. Elena Martinez',
      category: 'Science',
      content: `CRISPR-Cas9 has revolutionized the field of genetic engineering since its adaptation as a genome editing tool in 2012. Originally discovered as a natural defense mechanism in bacteria, CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) allows scientists to precisely cut and modify DNA sequences with unprecedented accuracy and efficiency. This breakthrough has opened new frontiers in medicine, agriculture, and fundamental biological research.

The mechanism of CRISPR-Cas9 relies on a guide RNA that directs the Cas9 protein to a specific location in the genome. Once the Cas9 protein binds to the target DNA sequence, it makes a precise double-strand break. The cell's natural repair mechanisms then either disrupt the gene or allow researchers to insert new genetic material. This process, which once took years using older techniques like zinc finger nucleases, can now be accomplished in days or weeks.

Medical applications of CRISPR are particularly promising. Clinical trials are underway for treating sickle cell disease, beta-thalassemia, and certain forms of blindness caused by genetic mutations. Researchers are also exploring CRISPR's potential in cancer immunotherapy, where the technology is used to engineer T-cells to better recognize and attack tumor cells. The first CRISPR-based therapy, Casgevy, received regulatory approval in 2023 for treating sickle cell disease.

Despite its enormous potential, CRISPR raises significant ethical questions. The possibility of germline editing — making heritable changes to embryos — has sparked global debate about designer babies and unintended consequences for future generations. The 2018 announcement by Chinese scientist He Jiankui that he had created gene-edited babies caused widespread scientific condemnation. The scientific community continues to develop ethical frameworks and regulatory guidelines to ensure that CRISPR's power is used responsibly.`,
    },
    {
      title: 'Black Holes and the Fabric of Spacetime',
      author: 'Prof. James Okafor',
      category: 'Science',
      content: `Black holes represent one of the most extreme and fascinating phenomena in the universe. Born from the gravitational collapse of massive stars, these regions of spacetime exhibit gravity so strong that nothing — not even light — can escape once it crosses the event horizon. First predicted by Einstein's general theory of relativity in 1916, black holes remained theoretical curiosities for decades before observational evidence began to accumulate.

The anatomy of a black hole consists of several key features. The event horizon marks the boundary beyond which escape becomes impossible; it is not a physical surface but a mathematical boundary in spacetime. At the center lies the singularity, a point of infinite density where the known laws of physics break down. Surrounding a rotating black hole is the ergosphere, a region where spacetime itself is dragged along with the black hole's rotation — a phenomenon called frame-dragging.

Our understanding of black holes advanced dramatically in 2019 when the Event Horizon Telescope collaboration released the first-ever image of a black hole's shadow — the supermassive black hole at the center of galaxy M87, with a mass 6.5 billion times that of our Sun. This image confirmed theoretical predictions about the shape and size of the photon ring surrounding a black hole's event horizon. In 2022, astronomers imaged Sagittarius A*, the black hole at the center of our own Milky Way galaxy.

Stephen Hawking's theoretical work predicted that black holes are not entirely black. Through a quantum mechanical process now known as Hawking radiation, black holes slowly emit thermal radiation and gradually lose mass over astronomical timescales. For stellar-mass black holes, this process is extraordinarily slow, but it raises profound questions about the fate of information that falls into a black hole — the so-called black hole information paradox, which remains one of the deepest unsolved problems at the intersection of quantum mechanics and general relativity.`,
    },
    {
      title: 'The Evolution of Artificial Intelligence: From Expert Systems to Large Language Models',
      author: 'Dr. Sarah Chen',
      category: 'Technology',
      content: `Artificial intelligence has undergone a remarkable transformation over the past seven decades, evolving from rule-based expert systems to sophisticated neural networks capable of generating human-like text, images, and code. The journey began in the 1950s with pioneers like Alan Turing, who posed the famous question "Can machines think?" and proposed the Turing Test as a benchmark for machine intelligence. Early AI systems were symbolic, relying on explicit rules and logical inference to solve problems.

The first wave of AI, characterized by expert systems in the 1970s and 1980s, showed promise in narrow domains. Systems like MYCIN could diagnose bacterial infections, and DENDRAL could analyze chemical compounds. However, these systems were brittle — they struggled outside their specific domains and required enormous effort to maintain and update their knowledge bases. The limitations of symbolic AI led to the first "AI winter," a period of reduced funding and interest in the 1980s.

The resurgence of neural networks in the 1990s and 2000s, driven by increased computational power and the availability of large datasets, marked a turning point. Deep learning architectures, particularly convolutional neural networks (CNNs), achieved breakthrough performance in image recognition tasks. The ImageNet competition in 2012, won decisively by AlexNet, demonstrated that deep neural networks could outperform traditional computer vision approaches by a significant margin, igniting the current era of deep learning.

Today's large language models (LLMs) like GPT-4, Claude, and Gemini represent the current frontier of AI. Trained on vast corpora of text using the transformer architecture introduced in the seminal 2017 paper "Attention Is All You Need," these models demonstrate remarkable capabilities in language understanding, reasoning, and generation. They can write code, summarize documents, translate languages, and engage in complex reasoning tasks. The rapid deployment of these systems has sparked intense debate about AI safety, alignment, and the societal implications of increasingly capable AI systems.`,
    },
    {
      title: 'Quantum Computing: Principles and Practical Applications',
      author: 'Dr. Raj Patel',
      category: 'Technology',
      content: `Quantum computing harnesses the principles of quantum mechanics to perform computations in fundamentally different ways than classical computers. While classical computers process information as binary bits — either 0 or 1 — quantum computers use quantum bits, or qubits, which can exist in superpositions of both states simultaneously. This property, along with quantum entanglement and interference, enables quantum computers to explore vast solution spaces in parallel, offering potential exponential speedups for certain classes of problems.

The theoretical foundation for quantum computing was laid by Richard Feynman and David Deutsch in the early 1980s. Feynman observed that classical computers struggle to simulate quantum systems efficiently, suggesting that a computer based on quantum mechanics could do so naturally. Peter Shor's 1994 algorithm demonstrated that a sufficiently powerful quantum computer could factor large integers exponentially faster than the best known classical algorithms — a finding with profound implications for cryptography, since the security of RSA encryption relies on the difficulty of factoring large numbers.

Building practical quantum computers presents enormous engineering challenges. Qubits are extraordinarily fragile; they must be isolated from environmental disturbances that cause "decoherence," the loss of quantum properties. Current quantum computers from companies like IBM, Google, and IonQ operate at temperatures close to absolute zero, far colder than outer space. Google's 2019 claim of "quantum supremacy" — demonstrating that their 53-qubit Sycamore processor completed a specific computation in 200 seconds that would take classical supercomputers thousands of years — generated both excitement and controversy in the field.

Despite these challenges, quantum computing is advancing rapidly. Near-term applications being explored include optimization problems in logistics and finance, drug discovery through molecular simulation, and machine learning acceleration. Quantum error correction, which uses redundant qubits to protect against errors, is a critical area of research. While fault-tolerant quantum computers capable of running Shor's algorithm on cryptographically relevant key sizes remain years away, quantum computing is transitioning from pure research to practical experimentation, with cloud-accessible quantum processors enabling researchers worldwide to develop quantum algorithms.`,
    },
    {
      title: 'The Enduring Legacy of Shakespeare: Language, Themes, and Modern Relevance',
      author: 'Prof. Anne Whitfield',
      category: 'Literature',
      content: `William Shakespeare, writing in the late sixteenth and early seventeenth centuries, produced a body of work that has profoundly shaped the English language and Western literary tradition. His thirty-seven plays and 154 sonnets explore the full range of human experience — love and betrayal, ambition and conscience, mortality and redemption — with a psychological depth and linguistic richness that continues to resonate with audiences four centuries after his death. Shakespeare's influence extends far beyond literature, permeating law, philosophy, psychology, and everyday speech.

Shakespeare's contribution to the English language is immeasurable. Scholars estimate that he coined or introduced over 1,700 words that are now standard in English vocabulary, including "bedroom," "eyeball," "lonely," "generous," and "obscene." His phrases have become proverbial: "all that glitters is not gold," "the lady doth protest too much," "to be or not to be," and hundreds more. This linguistic creativity reflected the dynamism of Elizabethan English, a language rapidly absorbing vocabulary from Latin, French, Italian, and other sources as England expanded its commercial and cultural horizons.

The themes of Shakespeare's major tragedies — Hamlet, Othello, King Lear, and Macbeth — engage with timeless questions of human nature. Hamlet's paralysis in the face of action and his meditation on consciousness have been interpreted through psychoanalytic, existentialist, and postcolonial lenses. Othello explores jealousy and race with a directness that remains urgent in contemporary discussions of prejudice. Macbeth's portrait of unchecked ambition and its moral consequences speaks to leaders and institutions across ages and cultures. This universality explains why Shakespeare is performed more frequently than any other playwright in the world.

Modern adaptations demonstrate Shakespeare's continuing vitality. Filmmakers from Laurence Olivier to Baz Luhrmann to Julie Taymor have reimagined his plays in radically different settings while preserving their essential power. "The Lion King" transposes Hamlet to the African savanna; "10 Things I Hate About You" relocates "The Taming of the Shrew" to a Seattle high school; Kurosawa's "Ran" transforms King Lear into a Japanese feudal epic. These adaptations reveal what is universal in Shakespeare's vision while allowing each generation to find its own meaning in his work.`,
    },
    {
      title: 'The Fall of the Roman Empire: Causes, Consequences, and Historical Lessons',
      author: 'Dr. Michael Rossi',
      category: 'History',
      content: `The fall of the Western Roman Empire in 476 CE, when the Germanic chieftain Odoacer deposed the last emperor Romulus Augustulus, marks one of history's most consequential transitions. Yet historians caution against viewing this as a sudden catastrophe; Rome's decline was a centuries-long process shaped by military pressures, economic dysfunction, political instability, and profound cultural transformation. Edward Gibbon's monumental "The History of the Decline and Fall of the Roman Empire," published in six volumes from 1776 to 1789, framed the debate that scholars continue to refine today.

Military and external pressures played a critical role in Rome's decline. The empire's vast frontiers — stretching from Britain to Mesopotamia — required enormous military resources to defend. The increasing reliance on Germanic foederati (allied troops) to fill the legions' ranks gradually blurred the distinction between Roman defenders and the barbarian groups they faced. The catastrophic Roman defeat at the Battle of Adrianople in 378 CE, where Gothic forces killed Emperor Valens and destroyed two-thirds of the Eastern Roman army, exposed the empire's military vulnerability and forced Rome to accommodate Germanic peoples within its borders on their own terms.

Economic deterioration compounded the military crisis. The third century CE saw persistent inflation as emperors debased the silver denarius to pay troops, eroding public confidence in the currency. Trade networks that had linked the Mediterranean world contracted. The tax burden on the remaining productive classes — small farmers and urban craftsmen — became crushing as the bureaucracy expanded while the productive base shrank. Large landowners increasingly sheltered their dependents from imperial taxation, prefiguring the feudal arrangements that would characterize medieval Europe.

The legacy of Rome, however, proved extraordinarily durable. Roman law formed the foundation of legal systems across Europe and Latin America. The Catholic Church preserved Latin as the language of learning and administration throughout the medieval period. Roman engineering achievements — roads, aqueducts, concrete construction — influenced builders for centuries. Perhaps most importantly, the idea of Rome itself — as a model of ordered, universal governance — inspired Charlemagne, the Holy Roman Emperors, Napoleon, and other rulers who sought to recapture its prestige. The question of what caused Rome's fall continues to generate scholarly debate, with modern historians emphasizing the complexity of transformation over simple narratives of decline.`,
    },
  ]

  for (const article of articles) {
    await prisma.article.create({ data: article })
  }

  console.log('Seeded 6 articles successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
