function HostelCardSkeleton({ rotate = "rotate-0" }) {
  return (
    <div className={`bg-paper poster-border rounded-2xl overflow-hidden ${rotate} animate-pulse`}>
      <div className="w-full h-52 bg-skytape border-b-2 border-ink" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-skytape rounded-full w-3/4" />
        <div className="h-3 bg-skytape rounded-full w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 bg-skytape rounded-full w-16" />
          <div className="h-6 bg-skytape rounded-full w-16" />
        </div>
        <div className="pt-4 border-t-2 border-dashed border-ink/10 flex justify-between items-center">
          <div className="h-7 bg-skytape rounded-full w-20" />
          <div className="h-9 bg-skytape rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default HostelCardSkeleton;
