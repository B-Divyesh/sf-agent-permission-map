#define _GNU_SOURCE

#include <fcntl.h>
#include <stdarg.h>
#include <stdlib.h>
#include <string.h>
#include <sys/syscall.h>
#include <unistd.h>

/*
 * Minimal Linux-only test shim. It records real open-family system calls made
 * by the inspected binary without calling libc from the hooks themselves.
 * The claim test compiles this fixture and injects it with LD_PRELOAD.
 */
static void record_open(const char *path) {
    const char *log_path = getenv("PERMIT_MAP_OPEN_LOG");
    if (log_path == NULL || path == NULL) {
        return;
    }

    int log = (int)syscall(
        SYS_openat,
        AT_FDCWD,
        log_path,
        O_WRONLY | O_CREAT | O_APPEND | O_CLOEXEC,
        0600
    );
    if (log < 0) {
        return;
    }
    syscall(SYS_write, log, path, strlen(path));
    syscall(SYS_write, log, "\n", 1);
    syscall(SYS_close, log);
}

static mode_t open_mode(int flags, va_list args) {
    return (flags & (O_CREAT | O_TMPFILE)) ? va_arg(args, mode_t) : 0;
}

int open(const char *path, int flags, ...) {
    va_list args;
    va_start(args, flags);
    mode_t mode = open_mode(flags, args);
    va_end(args);
    record_open(path);
    return (int)syscall(SYS_openat, AT_FDCWD, path, flags, mode);
}

int open64(const char *path, int flags, ...) {
    va_list args;
    va_start(args, flags);
    mode_t mode = open_mode(flags, args);
    va_end(args);
    record_open(path);
    return (int)syscall(SYS_openat, AT_FDCWD, path, flags, mode);
}

int openat(int directory, const char *path, int flags, ...) {
    va_list args;
    va_start(args, flags);
    mode_t mode = open_mode(flags, args);
    va_end(args);
    record_open(path);
    return (int)syscall(SYS_openat, directory, path, flags, mode);
}

int openat64(int directory, const char *path, int flags, ...) {
    va_list args;
    va_start(args, flags);
    mode_t mode = open_mode(flags, args);
    va_end(args);
    record_open(path);
    return (int)syscall(SYS_openat, directory, path, flags, mode);
}
