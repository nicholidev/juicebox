import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

const QAs: {
  q: string
  a?: string[]
  img?: {
    src: string
    alt: string
  }
}[] = [
  {
    q: 'Who funds Juice projects?',
    a: [
      `Users fund your project by paying to use your app or service, or as a patron or investor by making a payment directly to your project's smart contract (like on juice.work).`,
      `For users paying through your app, you should route those funds through the Juice smart contracts so they receive Tickets in return.`,
    ],
  },
  {
    q: `What does Juice cost?`,
    a: [
      `Juice is an open protocol on Ethereum that makes money using Juice itself. You can check out the contractualized budget specs at http://juice.work/p/juice.`,
      `5% of all money made using Juice is sent to help pay for Juice itself. In exchange, you get the opportunity to benefit from the overflow that the ecosystem accumulates over time.`,
    ],
  },
  {
    q: 'What are tickets?',
    a: [
      `Each project has its own ERC-1155 tickets, and everyone who funds a project earns a portion of them in return. Once a project is earning more than its target, tickets can be redeemed for a portion of the overflow.`,
    ],
  },
  {
    q: `Why should I want to own a project's Tickets?`,
    a: [
      `Tickets can be redeemed for a portion of a project's overflow, letting you benefit from the project's up-side.`,
      `If you earned a project's tickets at a discounted rate a while ago, the tickets will accumulate value over time as the project's overflow increases.`,
    ],
  },
  {
    q: `What's a discount rate?`,
    a: [
      `Juice projects can be created with an optional discount rate to incentivize funding the project earlier than later. With each new funding cycle, the discount rate decreases the number of tickets that are minted per payment.`,
      `For example: with a discount rate of 97%, $100 paid to a project today might mint you 100 tickets, but the same amount paid during the next funding cycle would only mint you 97.`,
    ],
  },
  {
    q: `What's a bonding curve?`,
    a: [
      `A bonding curve keeps tickets from being redeemable exploitatively.`,
      `Those who commit to waiting longer than others to redeem tickets will benefit the most from a project's overflow.`,
    ],
  },
  {
    q: 'Does a project benefit from its own overflow?',
    a: [
      `A project can choose to reserve a percentage of overflow for itself. Instead of being distributed to paying users, this percentage of minted tickets is instead transferred back to the project.`,
      `Holding these tickets entitles a project to a portion of its own overflow, which can create an incentive for the project owner to continue growing a project past its target.`,
    ],
  },
  {
    q: "Can I change my project's contract after it's been created?",
    a: [
      `A project owner can propose changes to any part of the contract at any time, with changes taking effect after the current budgeting time frame has ended. A minimum of 14 days must pass from the time of a proposed reconfiguration for it to take effect. This gives Ticket holders time to react to the decision.`,
    ],
  },
  {
    q: `Does putting a cap on profit remove incentive for project creators to innovate?`,
    a: [
      `If a maintainer team neglects a project or moves it in a direction that doesn’t work for the market, it could be forked by the community or simply given up by its users.`,
      "On the other hand, projects with a clear drive and sense of direction can propose ambitious budgets with their community's backing that allows them to charge forward, in the name of greater overflow for everyone over time.",
    ],
  },
  {
    q: `Can’t I still rake in unlimited profit if I set my budget target to a bajillion?`,
    a: [
      `Sure, although open source projects can always be forked. Or if the market prefers to support projects with more realistic budgets, yours might get outcompeted.`,
    ],
  },
  {
    q: `Do I have to make my project open source in order to use Juice as its business model?`,
    img: {
      src: '/assets/cooler_if_you_did.png',
      alt: "It'd be a lot cooler if you did",
    },
  },
]

export default function Faq() {
  return (
    <Collapse defaultActiveKey={QAs.length ? 0 : undefined} accordion>
      {QAs.map((qa, i) => (
        <CollapsePanel header={qa.q} key={i}>
          {qa.a && qa.a.map((p, j) => <p key={j}>{p}</p>)}
          {qa.img && <img src={qa.img.src} alt={qa.img.alt} />}
        </CollapsePanel>
      ))}
    </Collapse>
  )
}
