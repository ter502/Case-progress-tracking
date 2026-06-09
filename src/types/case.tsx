interface Case{
    id: string;
    employer: string;
    phone: string;
    country?: countryType;
    cause: countryType;
    status: statusType;
}

enum CaseProcess{
    jobPosting = "JOBPOSTING",
    recruit = "RECRUIT",
    hire = "HIRE",
    contract = "CONTRACT"
}

enum statusType{
    processing = "PROCESSING",
    finish = "FINISH"
}

enum countryType{

}