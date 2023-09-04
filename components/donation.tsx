// import { API_URL } from "../utils/api";
// import { type Donation } from "@/utils/types";
import { Paper, Text, Stack, Group, Title, Card } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface DonationInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  time: string;
}

export default function Donation() {
  const [list, setList] = useState<DonationInterface[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://donation-server-production.up.railway.app/donation")
        .then((res) => res.json())
        .then((res) => setList(res));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("https://donation-server-production.up.railway.app/donation")
      .then((res) => res.json())
      .then((res) => setList(res));
  }, []);

  return (
    <Card withBorder shadow="xs" bg="gray.3">
      <Group mb={20}>
        <Title order={1} color="gray">
          Total
        </Title>
        <Title order={1} variant="gradient">
          {list
            .reduce((partialSum, a) => partialSum + a.amount, 0)
            .toLocaleString("en-US")}
        </Title>
        <Title order={1} color="gray">
          THB
        </Title>
      </Group>
      <Stack>
        {list.map((doc) => {
          return (
            <Paper key={doc.id} shadow="xs" p="md">
              <Group>
                <Text>{doc.firstName}</Text>
                <Text>{doc.lastName}</Text>
                <Text>{doc.email}</Text>
                <Text>{doc.amount.toLocaleString("en-US")}</Text>
                <Text>{dayjs(doc.time).format("D-MMM HH:mm:ss")}</Text>
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
}