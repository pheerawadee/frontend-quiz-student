import { Input, Button, Card, Title, Stack } from "@mantine/core";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const initForm = {
  firstName: "",
  lastName: "",
  email: "",
  amount: "",
};

export default function Form() {
  const [form, setForm] = useState(initForm);

  const [error, setError] = useState(initForm);

  const [loading, setLoading] = useState(false);

  function onChange(event: React.FormEvent<EventTarget>) {
    const target = event.target as HTMLInputElement;
    setForm((state) => {
      return {
        ...state,
        [target.name]: target.value,
      };
    });
  }

  function validate() {
    var e = { ...initForm };

    if (form.firstName == "") {
      e.firstName = "firstname required";
    } else {
      e.firstName = "";
    }

    if (form.lastName == "") {
      e.lastName = "lastName required";
    } else {
      e.lastName = "";
    }

    if (form.email == "") {
      e.email = "email required";
    }

    if (form.email != "") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(form.email)) {
        e.email = "email badly format";
      } else {
        e.email = "";
      }
    }

    if (form.amount == "") {
      e.amount = "donation required";
    }

    if (form.amount != "") {
      const donationRegex = /^[1-9]\d*$/;

      if (!donationRegex.test(form.amount)) {
        e.amount = "donation badly format";
      } else {
        if (parseInt(form.amount) > 1000) {
          e.amount = "";
        } else {
          e.amount = "Amount must be greater than 1000";
        }
      }
    }

    setError(e);

    if (
      e.firstName == "" &&
      e.lastName == "" &&
      e.email == "" &&
      e.amount == ""
    )
      return true;
    else return false;
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (validate() && !loading) {
      setLoading(true);
      var response = await fetch(
        "https://donation-server-production.up.railway.app/donate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form }),
        }
      );

      var json = await response.json();
      console.log(json);
      if (json.status === "success") {
        toast.success("save!");
        setForm(initForm);
      } else {
        toast.error("internal server error");
      }
    }

    setLoading(false);
  }

  return (
    <Card withBorder shadow="xs" p="xl" bg="cyan.2">
      <Title order={1} color="blue">
        Donate
      </Title>
      <Toaster />

      {/* <span>{JSON.stringify(form)}</span> */}
      <form onSubmit={onSubmit}>
        <Stack spacing={"xs"}>
          <Input.Wrapper>
            <Input.Label>First Name</Input.Label>
            <Input
              required
              name="firstName"
              onChange={onChange}
              value={form.firstName}
            />
            <Input.Error>{error.firstName}</Input.Error>
          </Input.Wrapper>

          <Input.Wrapper>
            <Input.Label>Last Name</Input.Label>
            <Input
              required
              name="lastName"
              onChange={onChange}
              value={form.lastName}
            />
            <Input.Error>{error.lastName}</Input.Error>
          </Input.Wrapper>

          <Input.Wrapper>
            <Input.Label>Email</Input.Label>
            <Input
              required
              name="email"
              onChange={onChange}
              value={form.email}
            />
            <Input.Error>{error.email}</Input.Error>
          </Input.Wrapper>

          <Input.Wrapper>
            <Input.Label>Donation Amount</Input.Label>
            <Input
              required
              name="amount"
              onChange={onChange}
              value={form.amount}
            />
            <Input.Error>{error.amount}</Input.Error>
          </Input.Wrapper>
          <Button type="submit">{loading ? "submitting ..." : "Submit"}</Button>
        </Stack>
      </form>
    </Card>
  );
}