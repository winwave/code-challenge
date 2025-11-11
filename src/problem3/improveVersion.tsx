interface WalletBalance {
  id: string;
  currency: string;
  amount: number;
  blockchain: string;
}

interface Props extends BoxProps {
  children: ReactNode;
}

function getPriority(blockchain: string): number {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 10
    default:
      return -99
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    if (!balances) return [];

    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount <= 0;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority
    });
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.id}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.amount.toFixed(6)}
        />
      )
    })
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  )
}

// Version with virtual list
// https://tanstack.com/virtual/latest/docs/framework/react/examples/table

const WalletPageVirtualList: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowData = useMemo(() => {
    if (!balances || !prices) return [];

    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount <= 0;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority
    }).map((balance: WalletBalance) => {
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;
      return {
        id: balance.id,
        amount: balance.amount,
        usdValue: usdValue,
        formattedAmount: balance.amount.toFixed(6),
      };
    });
  }, [balances, prices]);

  // init virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div {...rest}>
      <div
        ref={parentRef}
        style={{
          height: '400px', // need a fixed height
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rowData[virtualItem.index];

            return (
              <div
                key={row.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <WalletRow
                  amount={row.amount}
                  usdValue={row.usdValue}
                  formattedAmount={row.formattedAmount}
                  className={classes.row}
                />
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  )
}
