// PLACEHOLDER CONTENT. Every project, metric and link below is invented to
// exercise the layout. Replace before this goes anywhere real.

export const projects = [
  {
    id: 'marginalia',
    name: 'Marginalia',
    role: 'Document intelligence with a per-field audit trail',
    body: [
      'Scanned invoices and bills of lading go in; typed, validated records come out, and every field carries the crop it was read from, the model that read it, and the rule that accepted it.',
      'Built for a freight broker whose AP team was keying 1,400 documents a week by hand. Field-level accuracy sits at 97.2% on their held-out set. The missing 2.8% is mostly handwriting scrawled over printed totals, which the extractor flags for review instead of guessing at. The audit trail was the whole reason it shipped — their controller would not sign off on a number she could not reconstruct.',
    ],
    stack: ['Python', 'PaddleOCR', 'ONNX Runtime', 'Postgres', 'FastAPI'],
    link: { label: 'How the audit trail works', href: '#' },
    panel: {
      label: 'extraction trace',
      meta: 'invoice_4471.pdf',
      rows: [
        { key: 'invoice_total', value: '$18,240.00', score: '0.99', bar: 0.99 },
        { key: 'carrier_scac', value: 'ODFL', score: '0.96', bar: 0.96 },
        { key: 'delivery_date', value: '2026-03-14', score: '0.93', bar: 0.93 },
        { key: 'po_number', value: 'held for review', score: '0.41', bar: 0.41, flag: true },
      ],
      note: 'total accepted: matches sum of 6 line items (rule R-12). po_number below 0.70 — routed to a human.',
    },
  },
  {
    id: 'handbook',
    name: 'Handbook',
    role: 'Retrieval assistant over clinical policy, evaluated before it shipped',
    body: [
      'Six thousand pages of clinical policy, searchable in plain language by the nursing staff of a regional hospital network.',
      'Retrieval was never the hard part. Proving the thing was safe to trust was. I wrote a 340-question eval set with two clinical educators and scored answers on whether the cited passage actually supported them, not on whether they read well — the two disagree more often than you would like. It went live once faithfulness held above 0.90 on the questions the retriever ranked worst, not on the average. It abstains on about 8% of questions. Staff complained about that for two weeks and then stopped.',
    ],
    stack: ['Python', 'pgvector', 'Ragas', 'vLLM', 'FastAPI'],
    link: { label: 'The eval set and what it caught', href: '#' },
    panel: {
      label: 'eval run',
      meta: '340 questions',
      rows: [
        { key: 'faithfulness', value: 'cited passage supports answer', score: '0.94', bar: 0.94 },
        { key: 'worst decile', value: 'low-rank retrievals only', score: '0.91', bar: 0.91 },
        { key: 'context recall', value: 'gold passage in top 8', score: '0.88', bar: 0.88 },
        { key: 'abstention', value: 'declined to answer', score: '0.08', bar: 0.08, flag: true },
      ],
      note: 'ship gate was the worst decile, not the mean. the mean hid a class of policy-conflict questions entirely.',
    },
  },
  {
    id: 'wake',
    name: 'Wake',
    role: 'Ranking for a catalogue where almost nothing has ratings',
    body: [
      'Ninety thousand independent films, and 70% of watch time going to titles with fewer than fifty ratings. Collaborative filtering has nothing to work with down there, so the model runs on the implicit signals most systems discard: trailer watch depth, second visits to a page, how long a synopsis sits on screen before a scroll.',
      'The non-obvious finding was that abandoning a trailer around forty seconds is a stronger positive signal than finishing one. People who finish trailers are browsing. People who stop are deciding. Weighting it that way moved cold-start click-through from 1.9% to 4.4% over eleven weeks — and made the popularity-bias problem worse before a re-ranking pass fixed it.',
    ],
    stack: ['PyTorch', 'Feast', 'Redis', 'Airflow', 'Go'],
    link: { label: 'Write-up of the modelling approach', href: '#' },
    panel: {
      label: 'candidate ranking',
      meta: 'user 3f21b · cold start',
      rows: [
        { key: 'trailer_exit_40s', value: 'strongest positive feature', score: '+0.31', bar: 0.86 },
        { key: 'repeat_page_view', value: 'within 72h', score: '+0.22', bar: 0.61 },
        { key: 'synopsis_dwell', value: '> 9s before scroll', score: '+0.14', bar: 0.39 },
        { key: 'genre_affinity', value: 'prior sessions', score: '+0.05', bar: 0.14 },
      ],
      note: 'attributions for the top-ranked title. popularity prior is subtracted after scoring, not before.',
    },
  },
  {
    id: 'corridor',
    name: 'Corridor',
    role: 'Simulated robot that has to look before it can navigate',
    body: [
      'A differential-drive robot is dropped on an unmapped office floor and told to reach a specific labelled door. It cannot plan a path to somewhere it has not found yet, so it has to explore, read signage, and decide. Nav2 drives, a small segmentation model reads door plates off the simulated camera, and a behaviour tree arbitrates between wandering and investigating.',
      'It completes the task in 41 of 50 randomised layouts. Honestly: it fails in simulation when two candidate doors are visible from one vantage point and it commits to the wrong one. It would fail far more often in a real building. The depth camera would fall apart on glass partitions, signage sits at angles Gazebo never renders, and nothing here has met a person walking through the frame. A success rate in sim says the planner is sound. It does not say the robot works.',
    ],
    stack: ['ROS 2', 'Nav2', 'Gazebo', 'Python', 'Behaviour trees'],
    link: { label: 'Run log and demo capture', href: '#' },
    panel: {
      label: 'mission log',
      meta: 'layout 27 / 50',
      rows: [
        { key: 't+00:14', value: 'frontier exploration started', score: 'ok', bar: null },
        { key: 't+01:02', value: 'signage detected — 2 candidates', score: '0.71', bar: 0.71, flag: true },
        { key: 't+01:19', value: 'approached nearer candidate', score: 'ok', bar: null },
        { key: 't+01:48', value: 'plate read: B-114 — target', score: '0.95', bar: 0.95 },
      ],
      note: 'the 0.71 is the interesting number. below about 0.65 it picks the closer door and is wrong half the time.',
    },
  },
  {
    id: 'rota',
    name: 'Rota',
    role: 'Shift scheduling for a restaurant group — the foundation for everything above',
    body: [
      'The first thing I built that other people depended on, and it is still running six years later across four kitchens.',
      'Availability, certifications, minor-labour rules and overtime thresholds all pull against each other, so a naive assignment loop produces a schedule no manager will sign. There is a constraint solver in here, but the solver is the small part. Most of the work is the unglamorous shell around it: auth, an audit log of who changed which shift, a printable weekly grid, and a phone view a line cook can read in a walk-in with cold hands. I keep it on this page because every project above assumes someone can build that shell, and this is where I learned to.',
    ],
    stack: ['Django', 'Postgres', 'OR-Tools', 'HTMX'],
    link: { label: 'Source', href: '#' },
    panel: {
      label: 'solver output',
      meta: 'week of 09 mar · 4 sites',
      rows: [
        { key: 'shifts filled', value: '112 of 112', score: 'ok', bar: null },
        { key: 'overtime hours', value: 'down from 31 last week', score: '4', bar: null },
        { key: 'cert conflicts', value: 'none — 2 blocked at assign', score: '0', bar: null },
        { key: 'solve time', value: 'p95 across 4 sites', score: '1.4s', bar: null },
      ],
      note: 'managers override roughly 6% of assignments. those overrides feed back in as soft constraints.',
    },
  },
]

export const skills = [
  {
    group: 'Modelling',
    items: ['PyTorch', 'scikit-learn', 'ONNX Runtime', 'Ragas', 'OR-Tools', 'PaddleOCR'],
  },
  {
    group: 'Systems',
    items: ['Python', 'Go', 'FastAPI', 'Django', 'Postgres', 'pgvector', 'Redis', 'Airflow'],
  },
  {
    group: 'Running it',
    items: ['Docker', 'GitHub Actions', 'Terraform', 'AWS ECS', 'Grafana', 'OpenTelemetry'],
  },
  {
    group: 'Robotics',
    items: ['ROS 2', 'Nav2', 'Gazebo', 'Open3D'],
  },
]
