import React from 'react';

// Utility for classes (simplified cn)
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// --- INPUT ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// --- CARD ---
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// --- BADGE ---
export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" }) => {
    const variants = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground",
    };
    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
    )
}

// --- LABEL ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  )
);

// --- SELECT ---
interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}
const SelectContext = React.createContext<SelectContextValue | null>(null);

export const Select = ({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};
export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => ctx?.setOpen(!ctx?.open)}
        className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const ctx = React.useContext(SelectContext);
  return <span>{ctx?.value || placeholder}</span>;
};
export const SelectContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = React.useContext(SelectContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
};
export const SelectItem = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const ctx = React.useContext(SelectContext);
  return (
    <div
      role="option"
      className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
      onClick={() => { ctx?.onValueChange(value); ctx?.setOpen(false); }}
    >
      {children}
    </div>
  );
};

// --- TABS ---
interface TabsContextValue { value: string; onValueChange: (v: string) => void }
const TabsContext = React.createContext<TabsContextValue | null>(null);
export const Tabs = ({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider>
);
export const TabsList = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props}>{children}</div>
);
export const TabsTrigger = ({ value, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <button type="button" onClick={() => ctx?.onValueChange(value)} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", isActive && "bg-background text-foreground shadow-sm", className)} {...props}>{children}</button>
  );
};

// --- DIALOG ---
interface DialogContextValue { open: boolean; onOpenChange: (open: boolean) => void }
const DialogContext = React.createContext<DialogContextValue | null>(null);
export const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (o: boolean) => { if (isControlled) onOpenChange?.(o); else setInternalOpen(o); };
  return <DialogContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>{children}</DialogContext.Provider>;
};
export const DialogTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => {
  const ctx = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, { onClick: () => ctx?.onOpenChange(true) });
  return <button type="button" onClick={() => ctx?.onOpenChange(true)}>{children}</button>;
};
export const DialogContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = React.useContext(DialogContext);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => ctx.onOpenChange(false)} />
      <div role="dialog" className={cn("relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg", className)} {...props} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
export const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
export const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn("text-sm text-muted-foreground", className)} {...props} />;

// --- ACCORDION ---
interface AccordionContextValue { openValue: string | null; setOpenValue: (v: string | null) => void; collapsible?: boolean }
const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string>("");
export const Accordion = ({ type, collapsible, children, className }: { type?: string; collapsible?: boolean; children: React.ReactNode; className?: string }) => {
  const [openValue, setOpenValue] = React.useState<string | null>(null);
  return <AccordionContext.Provider value={{ openValue, setOpenValue, collapsible }}><div className={cn(className)}>{children}</div></AccordionContext.Provider>;
};
export const AccordionItem = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => (
  <AccordionItemContext.Provider value={value}><div className={cn("border-b", className)}>{children}</div></AccordionItemContext.Provider>
);
export const AccordionTrigger = ({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  const ctx = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = ctx?.openValue === itemValue;
  return (
    <button type="button" className={cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)} onClick={() => ctx?.setOpenValue(isOpen && ctx?.collapsible ? null : itemValue)} {...props}>{children}</button>
  );
};
export const AccordionContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const ctx = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  if (ctx?.openValue !== itemValue) return null;
  return <div className={cn("overflow-hidden text-sm", className)} {...props}>{children}</div>;
};

// --- ALERT ---
export const Alert = ({ variant = "default", className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }) => {
  const variants = { default: "border-border bg-background", destructive: "border-destructive/50 text-destructive bg-destructive/10" };
  return <div role="alert" className={cn("relative w-full rounded-lg border p-4", variants[variant], className)} {...props} />;
};
export const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />;
export const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
