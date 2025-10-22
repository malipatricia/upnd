/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

export function DatePick(field: {
    field: any
  }) {
    const [stringDate, setStringDate] = React.useState<string>("")
    const [date, setDate] = React.useState<Date>()
    const [errorMessage, setErrorMessage] = React.useState<string>("")
  
    return (
      <Popover>
        <div className="relative w-[280px]">
          <Input
            type="string"
            value={stringDate}
            onChange={(e) => {
              setStringDate(e.target.value)
              const parsedDate = new Date(e.target.value)
              if (parsedDate.toString() === "Invalid Date") {
                setErrorMessage("Invalid Date")
                setDate(undefined)
              } else {
                setErrorMessage("")
                setDate(parsedDate)
              }
            }}
          />
          {errorMessage !== "" && (
            <div className="absolute bottom-[-1.75rem] left-0 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              {field.field.value ? format(field.field.value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            // selected={date}
            // onSelect={(selectedDate) => {
            //   if (!selectedDate) return
            //   setDate(selectedDate)
            //   setStringDate(format(selectedDate, "MM/dd/yyyy"))
            //   setErrorMessage("")
            // }}
            selected={field.field.value}
            onSelect={field.field.onChange}
            defaultMonth={date}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }